import InternalServerError from '../../errors/InternalServerError';
import { encryptPasswordAsync } from '../../utils/encryption';
import { createSocialUserPassword } from '../../utils/passwordUtils';
import { getLoginTokens } from '../auth/auth.service';
import User from '../user/user.model';
import { UserInstanceData, UserLoginData } from '../user/user.types';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import axios, { AxiosResponse } from 'axios';
import { FacebookResponse, FacebookVerifyResponse } from './social.types';
import UnauthorizedError from '../../errors/UnauthorizedError';
//import FB from 'fb';
const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

export const registerOrLoginGoogleUser = async (token: string): Promise<UserLoginData> => {
    const { sub, email, given_name, family_name }: TokenPayload = await googleVerify(token);
    const userData: UserInstanceData = {
        email,
        password: "",
        displayName: "",
        googleId: sub,
    }
    const generatedPassword = createSocialUserPassword();
    userData.password = await encryptPasswordAsync(generatedPassword);
    userData.displayName = `${given_name}${given_name && family_name && " "}${family_name}`;
    const user = new User(userData);

    const existingSocialUser = await user.getByGoogleId();
    if (existingSocialUser) {
        return getLoginTokens(existingSocialUser.id);
    }

    const existingLocalUser = await user.getByEmail();
    if (existingLocalUser) {
        if (!existingLocalUser.isVerified || !existingLocalUser.googleId) {
            await user.setGoogleId();
        }
        return getLoginTokens(existingLocalUser.id);
    }

    const createdUser = await user.createSocial();
    if (!createdUser) throw new InternalServerError();
    return getLoginTokens(createdUser.id);
}

export const registerOrLoginFacebookUser = async (data: FacebookResponse): Promise<any> => {
    const userId: string = await facebookVerify(data);
    if (!userId) throw new UnauthorizedError();

    const userData: UserInstanceData = {
        email: data.email,
        password: "",
        displayName: data.name,
        facebookId: userId
    }
    const generatedPassword = createSocialUserPassword();
    userData.password = await encryptPasswordAsync(generatedPassword);
    const user = new User(userData);

    const existingSocialUser = await user.getByFacebookId();
    if (existingSocialUser) {
        return getLoginTokens(existingSocialUser.id);
    }

    if (user.email) {
        const existingLocalUser = await user.getByEmail();
        if (existingLocalUser) {
            if (!existingLocalUser.isVerified || !existingLocalUser.facebookId) {
                await user.setFacebookId();
            }
            return getLoginTokens(existingLocalUser.id);
        }
    }

    const createdUser = await user.createSocial();
    if (!createdUser) throw new InternalServerError();
    return getLoginTokens(createdUser.id);
}

export const googleVerify = async (token: string): Promise<TokenPayload> => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
    });
    const payload = ticket.getPayload();
    return payload;
}

export const facebookVerify = async (data: FacebookResponse): Promise<string> => {
    const req: AxiosResponse<FacebookVerifyResponse> = await axios.get(`https://graph.facebook.com/debug_token?input_token=${data.accessToken}&access_token=${data.accessToken}`);
    const { app_id, is_valid, user_id } = req.data.data;
    if (is_valid && app_id === process.env.FB_APP_ID && user_id === data.userID) {
        return user_id;
    }
    return null;
}