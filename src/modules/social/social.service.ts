import InternalServerError from '../../errors/InternalServerError';
import { encryptPasswordAsync } from '../../utils/encryption';
import { createSocialUserPassword } from '../../utils/passwordUtils';
import { getLoginTokens } from '../auth/auth.service';
import User from '../auth/auth.model';
import { UserData, UserInstanceData, UserLoginData, UserLoginTokenData } from '../auth/auth.types';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import axios, { AxiosResponse } from 'axios';
import { FacebookResponse, FacebookVerifyResponse } from './social.types';
import UnauthorizedError from '../../errors/UnauthorizedError';
import { createToken } from '../../utils/jwtTokenUtils';
import { TokenDurationFor } from '../../types/main';
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, GOOGLE_CLIENT_ID } = process.env;
//import FB from 'fb';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

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
        return getSocialLoginData(existingSocialUser);
    }

    const existingLocalUser = await user.getByEmail();
    if (existingLocalUser) {
        if (!existingLocalUser.isVerified || !existingLocalUser.googleId) {
            await user.setGoogleId();
        }
        return getSocialLoginData(existingLocalUser);
    }

    const createdUser = await user.createSocial();
    if (!createdUser) throw new InternalServerError();
    return getSocialLoginData(createdUser);
}

export const registerOrLoginFacebookUser = async (data: FacebookResponse): Promise<UserLoginData> => {
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
        return getSocialLoginData(existingSocialUser);
    }

    if (user.email) {
        const existingLocalUser = await user.getByEmail();
        if (existingLocalUser) {
            if (!existingLocalUser.isVerified || !existingLocalUser.facebookId) {
                await user.setFacebookId();
            }
            return getSocialLoginData(existingLocalUser);
        }
    }

    const createdUser = await user.createSocial();
    if (!createdUser) throw new InternalServerError();
    return getSocialLoginData(createdUser);
}

export const googleVerify = async (token: string): Promise<TokenPayload> => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
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

export const getSocialLoginData = (user: UserData): UserLoginData => {
    const { id, email, displayName } = user;
    const accessToken = createToken(user.id, ACCESS_TOKEN_SECRET, TokenDurationFor.Access, true);
    const refreshToken = createToken(user.id, REFRESH_TOKEN_SECRET, TokenDurationFor.Refresh, true);
    return { id, email, displayName, accessToken, refreshToken };
}