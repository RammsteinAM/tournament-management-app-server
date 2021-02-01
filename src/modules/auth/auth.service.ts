import { DecodedTokenData, UserAuthData, UserCreateData, UserData, UserLoginCheckResData, UserLoginData, UserLoginTokenData, UserResetPasswordData, UserVerificationData } from "../../modules/user/user.types";
import BadRequestError from "../../errors/BadRequestError";
import { checkPasswordAsync, encryptPasswordAsync } from "../../utils/encryption";
import { createToken, getVerifiedData, verifyTokenData } from "../../utils/jwtTokenUtils";
import { generateVerificationEmail, sendEmail } from "../../utils/emailUtils";
import User from "../user/user.model";
import UnprocessableEntity from "../../errors/UnprocessableEntity";
import UnauthorizedError from "../../errors/UnauthorizedError";
import { TokenDurationFor } from "../../types/main";
import ForbiddenError from "../../errors/ForbiddenError";
import InternalServerError from "../../errors/InternalServerError";
import { getDateDiffInSeconds } from "../../utils/dateUtils";
import { ErrorNames } from "../../types/error";
import { access } from "fs";
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, VERIFICATION_TOKEN_SECRET } = process.env;

export const registerUserService = async (userCreationData: UserCreateData): Promise<UserData> => {
    const encryptedPassword = await encryptPasswordAsync(userCreationData.password);
    const userData = { ...userCreationData, password: encryptedPassword };
    const user = new User(userData);
    const existingUser = await user.getByEmail();
    if (existingUser) {
        throw new BadRequestError("Email already in use", ErrorNames.EmailInUse);
    }
    const createdUser = await user.create();
    if (!createdUser) throw new InternalServerError();
    generateAndSendVerificationEmail(createdUser);
    return createdUser;
}

export const generateAndSendVerificationEmail = async (dbUser: UserData, resend = false): Promise<void> => {
    if (dbUser.isVerified) throw new BadRequestError("User is already verified", ErrorNames.AlreadyVerified);
    if (resend && getDateDiffInSeconds(dbUser.updatedAt) < 60) throw new BadRequestError("Cannot process the request", ErrorNames.EmailRequestSmallInterval);
    const user = new User({ id: dbUser.id });
    const token = createToken(dbUser.id, VERIFICATION_TOKEN_SECRET, TokenDurationFor.Verification);
    user.setVerificationToken(token);
    const emailData = generateVerificationEmail(dbUser.email, dbUser.displayName, token);
    await sendEmail(emailData);
}

export const verifyUserService = async (data: UserVerificationData): Promise<UserData> => {
    const tokenData: DecodedTokenData = getVerifiedData(data.token, VERIFICATION_TOKEN_SECRET);
    const user = new User(tokenData);
    const existingUser = await user.getById();
    if (!existingUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);
    if (existingUser.verificationToken !== data.token) throw new BadRequestError("Verification token is invalid", ErrorNames.InvalidToken);
    if (existingUser.isVerified) throw new UnprocessableEntity();
    return await user.verify();
}

export const getAuthorizedUser = async (data: UserAuthData): Promise<UserData> => {
    const user = new User({ email: data.email });
    const dbUser = await user.getByEmail();
    if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);
    const isPasswordCorrect = await checkPasswordAsync(data.password, dbUser.password);
    if (!isPasswordCorrect) throw new UnauthorizedError("Password is incorrect", ErrorNames.WrongPassword);
    return dbUser;
}

export const getAuthorizedAndVerifiedUser = async (data: UserAuthData): Promise<UserData> => {
    const user = await getAuthorizedUser(data);
    if (!user.isVerified) throw new ForbiddenError("User is not verified", ErrorNames.UserNotVerified);
    return user;
}

export const resetPasswordService = async (data: UserResetPasswordData): Promise<UserData> => {
    const tokenData: DecodedTokenData = getVerifiedData(data.token, VERIFICATION_TOKEN_SECRET);
    const encryptedPassword = await encryptPasswordAsync(data.password);
    const user = new User({ ...tokenData, password: encryptedPassword });
    const dbUser = await user.getById();
    if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);
    if (dbUser.passwordResetToken !== data.token) throw new BadRequestError("Invalid Token", ErrorNames.InvalidToken);

    return await user.updateById();
}

export const getLoginTokens = (id: number, social = false): UserLoginTokenData => {
    const accessToken = createToken(id, ACCESS_TOKEN_SECRET, TokenDurationFor.Access, social);
    const refreshToken = createToken(id, REFRESH_TOKEN_SECRET, TokenDurationFor.Refresh, social);
    return { accessToken, refreshToken };
}

export const obtainAccessTokenFromRefreshToken = async (refreshToken: string): Promise<string> => {
    const { id, social } = getVerifiedData(refreshToken, REFRESH_TOKEN_SECRET);
    const accessToken = createToken(id, ACCESS_TOKEN_SECRET, TokenDurationFor.Access, social);
    return accessToken;
}

export const loginCheckService = async (tokenData: UserLoginTokenData): Promise<UserLoginCheckResData> => {
    const { accessToken, refreshToken } = tokenData;

    let validAccessTokenData: DecodedTokenData;
    let newAccessToken: string = "";
    try {
        validAccessTokenData = verifyTokenData(accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {
        newAccessToken = await obtainAccessTokenFromRefreshToken(refreshToken);
        validAccessTokenData = verifyTokenData(newAccessToken, ACCESS_TOKEN_SECRET);
    }
    
    const user = new User(validAccessTokenData);
    const dbUser = await user.getById();
    if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);
    return {
        id: dbUser.id,
        displayName: dbUser.displayName,
        email: dbUser.email,
        accessToken: newAccessToken,
        social: validAccessTokenData.social
    };
}