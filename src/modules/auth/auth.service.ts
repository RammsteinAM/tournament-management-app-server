import { DecodedTokenData, UserAuthData, UserCreateData, UserData, UserLoginData, UserLoginTokenData, UserVerificationData } from "../../modules/user/user.types";
import BadRequestError from "../../errors/BadRequestError";
import { checkPasswordAsync, encryptPasswordAsync } from "../../utils/encryption";
import { createToken, getVerifiedData } from "../../utils/jwtTokenUtils";
import { generateVerificationEmail, sendEmail } from "../../utils/emailUtils";
import User from "../user/user.model";
import UnprocessableEntity from "../../errors/UnprocessableEntity";
import UnauthorizedError from "../../errors/UnauthorizedError";
import { TokenDurationFor } from "../../types/main";
import ForbiddenError from "../../errors/ForbiddenError";
import InternalServerError from "../../errors/InternalServerError";
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const registerUserService = async (userCreationData: UserCreateData): Promise<UserData> => {
    const encryptedPassword = await encryptPasswordAsync(userCreationData.password);
    const userData = { ...userCreationData, password: encryptedPassword };
    const user = new User(userData);
    const existingUser = await user.getByEmail();
    if (existingUser) {
        throw new BadRequestError("Email already in use", "RegistrationError");
    }
    const createdUser = await user.create();
    if (!createdUser) throw new InternalServerError();
    generateAndSendVerificationEmail(createdUser);
    return createdUser;
}

export const generateAndSendVerificationEmail = async (dbUser: UserData): Promise<void> => {
    if (dbUser.isVerified) throw new BadRequestError("User is already verified");
    const user = new User({ id: dbUser.id });
    const token = createToken(dbUser.id, process.env.VERIFICATION_TOKEN_SECRET, TokenDurationFor.Verification);
    user.setVerificationToken(token);
    const emailData = generateVerificationEmail(dbUser.email, dbUser.displayName, token);
    await sendEmail(emailData);
}

export const verifyUserService = async (data: UserVerificationData): Promise<UserData> => {
    const tokenData: DecodedTokenData = getVerifiedData(data.token, process.env.VERIFICATION_TOKEN_SECRET);
    const user = new User(tokenData);
    const existingUser = await user.getById();
    if (!existingUser) throw new BadRequestError("User not found");
    if (existingUser.verificationToken !== data.token) throw new BadRequestError("Verification token is invalid");
    if (existingUser.isVerified) throw new UnprocessableEntity();
    return await user.verify();
}

export const getAuthorizedUser = async (data: UserAuthData): Promise<UserData> => {
    const user = new User({ email: data.email });
    const dbUser = await user.getByEmail();
    if (!dbUser) throw new BadRequestError("User not found");
    const isPasswordCorrect = await checkPasswordAsync(data.password, dbUser.password);
    if (!isPasswordCorrect) throw new UnauthorizedError("Password is incorrect");
    return dbUser;
}

export const getAuthorizedAndVerifiedUser = async (data: UserAuthData): Promise<UserData> => {
    const user = await getAuthorizedUser(data);
    if (!user.isVerified) throw new ForbiddenError("User is not verified");
    return user;
}

export const getLoginTokens = (id: number): UserLoginTokenData => {
    const accessToken = createToken(id, ACCESS_TOKEN_SECRET, TokenDurationFor.Access);
    const refreshToken = createToken(id, REFRESH_TOKEN_SECRET, TokenDurationFor.Refresh);
    return { accessToken, refreshToken };
}