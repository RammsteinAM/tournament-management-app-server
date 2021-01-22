import BadRequestError from "../../../src/errors/BadRequestError";
import { UserData, UserEditRequestData } from "../../modules/user/user.types";
import { checkPasswordAsync, encryptPasswordAsync } from "../../utils/encryption";
import User from "./user.model";
import UnauthorizedError from "../../errors/UnauthorizedError";
import { createToken } from "../../utils/jwtTokenUtils";
import { TokenDurationFor } from "../../types/main";
import { generatePasswordResetEmail, generateVerificationEmail, sendEmail } from "../../utils/emailUtils";

export const getUserById = async (id: number): Promise<UserData> => {
    const user = new User({ id });
    return await user.getById();
};

export const updateUser = async (id: number, { displayName, currentPassword, password }: UserEditRequestData): Promise<UserData> => {
    let encryptedPassword: string = null;
    if (currentPassword) {
        encryptedPassword = await encryptPasswordAsync(password);
    }
    const user = new User({ id, displayName, password: encryptedPassword });
    const dbUser = await user.getById();
    if (!dbUser) throw new BadRequestError("User not found");

    if (currentPassword) {
        const isPasswordCorrect = await checkPasswordAsync(currentPassword, dbUser.password);
        if (!isPasswordCorrect) throw new UnauthorizedError("Password is incorrect");
    }

    const updatedUser = await user.updateById();
    return updatedUser;
};

export const deleteUserByEmail = async (email: string) => {
    // const todo = await Todo.findByIdAndDelete(id);
    // if (!todo) throw new HttpError(400, "Item not found.");
}

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    const user = new User({ email });
    const dbUser = await user.getByEmail();
    if(!dbUser) throw new BadRequestError("User not found", "UserNotFoundError");
    const token = createToken(dbUser.id, process.env.VERIFICATION_TOKEN_SECRET, TokenDurationFor.PasswordReset);
    user.sePasswordResetToken(token);
    const emailData = generatePasswordResetEmail(dbUser.email, dbUser.displayName, token);
    await sendEmail(emailData);
}