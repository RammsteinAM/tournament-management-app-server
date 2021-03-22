// import BadRequestError from "../../../src/errors/BadRequestError";
// import { UserData, UserEditRequestData } from "../auth/auth.types";
// import { checkPasswordAsync, encryptPasswordAsync } from "../../utils/encryption";
// import User from "../auth/auth.model";
// import UnauthorizedError from "../../errors/UnauthorizedError";
// import { createToken } from "../../utils/jwtTokenUtils";
// import { Locales, TokenDurationFor } from "../../types/main";
// import { generatePasswordResetEmail, sendEmail } from "../../utils/emailUtils";
// import { ErrorNames } from "../../types/error";

// export const getUserById = async (id: number): Promise<UserData> => {
//     const user = new User({ id });
//     return await user.getById();
// };

// export const updateUser = async (id: number, { displayName, currentPassword, password }: UserEditRequestData): Promise<UserData> => {
//     let encryptedPassword: string = null;
//     if (currentPassword) {
//         encryptedPassword = await encryptPasswordAsync(password);
//     }
//     const user = new User({ id, displayName, password: encryptedPassword });
//     const dbUser = await user.getById();
//     if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);

//     if (currentPassword) {
//         const isPasswordCorrect = await checkPasswordAsync(currentPassword, dbUser.password);
//         if (!isPasswordCorrect) throw new UnauthorizedError("Password is incorrect", ErrorNames.WrongPassword);
//     }

//     const updatedUser = await user.updateById();
//     return updatedUser;
// };

// export const sendPasswordResetEmail = async (email: string, locale: keyof typeof Locales): Promise<void> => {
//     const user = new User({ email });
//     const dbUser = await user.getByEmail();
//     if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);
//     if (dbUser.googleId || dbUser.facebookId) throw new BadRequestError("Password reset is not possible", ErrorNames.SocialUserForgotPassword);
//     const token = createToken(dbUser.id, process.env.VERIFICATION_TOKEN_SECRET, TokenDurationFor.PasswordReset);
//     user.sePasswordResetToken(token);
//     const emailData = generatePasswordResetEmail(dbUser.email, dbUser.displayName, token, locale);
//     await sendEmail(emailData);
// }