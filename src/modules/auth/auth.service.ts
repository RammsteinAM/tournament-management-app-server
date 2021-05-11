import { DecodedTokenData, UserAuthData, UserCreateData, UserData, UserEditRequestData, UserLoginCheckResData, UserLoginTokenData, UserResetPasswordData, UserVerificationData } from "./auth.types";
import BadRequestError from "../../errors/BadRequestError";
import { checkPasswordAsync, encryptPasswordAsync } from "../../utils/encryption";
import { createToken, getTokenData, getVerifiedData, verifyTokenData } from "../../utils/jwtTokenUtils";
import { generateVerificationEmail, generateDeleteAccountEmail, sendEmail, generatePasswordResetEmail, generateAccountDeletedEmail } from "../../utils/emailUtils";
import User from "./auth.model";
import UnprocessableEntity from "../../errors/UnprocessableEntity";
import UnauthorizedError from "../../errors/UnauthorizedError";
import { Locales, TokenDurationFor } from "../../types/main";
import { getDateDiffInSeconds } from "../../utils/dateUtils";
import { ErrorNames } from "../../types/error";
import NotFoundError from "../../errors/NotFoundError";
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, VERIFICATION_TOKEN_SECRET } = process.env;

export const registerUser = async (userCreationData: UserCreateData, locale: keyof typeof Locales): Promise<UserData> => {
    const encryptedPassword = await encryptPasswordAsync(userCreationData.password);
    const userData = { ...userCreationData, password: encryptedPassword };
    const user = new User(userData);
    const existingUser = await user.getByEmail();
    if (existingUser) {
        throw new BadRequestError("Email already in use", ErrorNames.EmailInUse);
    }
    const createdUser = await user.create();
    generateAndSendVerificationEmail(createdUser, locale);
    return createdUser;
}

export const isEmailRegistered = async (email: string): Promise<void> => {
    const user = new User({ email });
    const existingUser = await user.getByEmail();
    if (existingUser) {
        throw new BadRequestError("Email already in use", ErrorNames.EmailInUse);
    }
}

export const generateAndSendVerificationEmail = async (dbUser: UserData, locale: keyof typeof Locales, resend = false): Promise<void> => {
    if (dbUser.isVerified) throw new BadRequestError("User is already verified", ErrorNames.AlreadyVerified);
    if (resend && getDateDiffInSeconds(dbUser.updatedAt) < 60) throw new BadRequestError("Cannot process the request", ErrorNames.EmailRequestSmallInterval);
    const user = new User({ id: dbUser.id });
    const token = createToken(dbUser.id, VERIFICATION_TOKEN_SECRET, TokenDurationFor.Verification);
    await user.setVerificationToken(token);
    const emailData = generateVerificationEmail(dbUser.email, dbUser.displayName, token, locale);
    await sendEmail(emailData);
}

export const verifyUser = async (data: UserVerificationData): Promise<UserData> => {
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
    if (!user.isVerified) throw new BadRequestError("User is not verified", ErrorNames.UserNotVerified);
    return user;
}

export const getUserById = async (id: number): Promise<UserData> => {
    const user = new User({ id });
    const dbUser = await user.getById();
    if (!dbUser) throw new NotFoundError("User not found", ErrorNames.UserNotFound);
    return dbUser;
}

export const getUserByEmail = async (email: string): Promise<UserData> => {
    const user = new User({ email });
    const dbUser = await user.getById();
    if (!dbUser) throw new NotFoundError("User not found", ErrorNames.UserNotFound);
    return dbUser;
}

export const sendPasswordResetEmail = async (email: string, locale: keyof typeof Locales): Promise<void> => {
    const user = new User({ email });
    const dbUser = await user.getByEmail();
    if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);
    if (dbUser.googleId || dbUser.facebookId) throw new BadRequestError("Password reset is not possible", ErrorNames.SocialUserForgotPassword);
    const token = createToken(dbUser.id, process.env.VERIFICATION_TOKEN_SECRET, TokenDurationFor.PasswordReset);
    user.sePasswordResetToken(token);
    const emailData = generatePasswordResetEmail(dbUser.email, dbUser.displayName, token, locale);
    await sendEmail(emailData);
}

export const resetPassword = async (data: UserResetPasswordData): Promise<UserData> => {
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

export const loginCheck = async (tokenData: UserLoginTokenData): Promise<UserLoginCheckResData> => {
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

export const checkAccessToken = async (tokenData: UserLoginTokenData): Promise<string | null> => {
    const { accessToken, refreshToken } = tokenData;

    let newAccessToken: string | null = null;
    let validAccessTokenData: DecodedTokenData = verifyTokenData(accessToken, ACCESS_TOKEN_SECRET);
    const tokenDataWithExp: any = getTokenData(accessToken);
    const tokenExpDate = tokenDataWithExp?.exp && new Date(tokenDataWithExp.exp * 1000).getTime();

    const now = new Date().getTime();
    if ((tokenExpDate - now) / 1000 < 300) {
        newAccessToken = await obtainAccessTokenFromRefreshToken(refreshToken);
        validAccessTokenData = verifyTokenData(newAccessToken, ACCESS_TOKEN_SECRET);
    }

    return newAccessToken;
}

export const updateUser = async (id: number, { displayName, currentPassword, password }: UserEditRequestData): Promise<UserData> => {
    let encryptedPassword: string = null;
    if (currentPassword) {
        encryptedPassword = await encryptPasswordAsync(password);
    }
    const user = new User({ id, displayName, password: encryptedPassword });
    const dbUser = await user.getById();
    if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);

    if (currentPassword) {
        const isPasswordCorrect = await checkPasswordAsync(currentPassword, dbUser.password);
        if (!isPasswordCorrect) throw new UnauthorizedError("Password is incorrect", ErrorNames.WrongPassword);
    }

    const updatedUser = await user.updateById();
    return updatedUser;
}

export const deleteAccountEmailRequest = async (id: number, locale: keyof typeof Locales) => {
    const user = new User({ id });
    const dbUser = await user.getById();
    if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);
    const token = createToken(dbUser.id, VERIFICATION_TOKEN_SECRET, TokenDurationFor.DeleteAccount);
    await user.setVerificationToken(token);
    const emailData = generateDeleteAccountEmail(dbUser.email, dbUser.displayName, token, locale);
    await sendEmail(emailData);
    return user;
}

export const deleteUser = async (data: UserVerificationData, locale: keyof typeof Locales): Promise<void> => {
    const tokenData: DecodedTokenData = getVerifiedData(data.token, VERIFICATION_TOKEN_SECRET);
    const user = new User({ id: tokenData.id });
    const dbUser = await user.getById();
    if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);
    if (dbUser.verificationToken !== data.token) throw new BadRequestError("Verification token is invalid", ErrorNames.InvalidToken);
    await user.deleteById();
    const emailData = generateAccountDeletedEmail(dbUser.email, locale);
    await sendEmail(emailData);
}