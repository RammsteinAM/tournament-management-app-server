import BadRequestError from "../../../src/errors/BadRequestError";
import prisma from "../../../prisma/prisma";
import { DecodedTokenData, UserAuthData, UserCreateData as UserCreationData, UserData, UserVerificationData } from "../../modules/user/user.types";
import { ErrorNames } from "../../types/errorNames";
import NotFoundError from "../../errors/NotFoundError";
import { checkPasswordAsync } from "../../utils/encryption";
import { createUserVerificationToken, getTokenData } from "../../utils/jwtTokenUtils";
import { generateVerificationEmail, sendVerificationEmail } from "../../utils/emailUtils";
import UnprocessableEntity from "../../errors/UnprocessableEntity";

export const findUserByEmail = async (email: string): Promise<UserData> => {
    // const todo = await Todo.findById(id);
    // if (!todo) throw new HttpError(404, "Item not found.");
    // return todo;
    return await prisma.user.findUnique({ where: { email } })
};

export const createUser = async (userData: UserCreationData) => {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new BadRequestError(ErrorNames.Registration, "Email already in use");
    }
    const user = await prisma.user.create({ data: userData });
    if (user) {
        const token = createUserVerificationToken(user.email);
        const emailData = generateVerificationEmail(user.email, user.displayName, token);
        await sendVerificationEmail(emailData)
    }
    return user;
};

export const verifyUser = async (data: UserVerificationData) => {
    const tokenData = getTokenData(data.token);
    const existingUser = await findUserByEmail(tokenData.email);
    if (!existingUser) throw new BadRequestError(ErrorNames.NotFound, "User not found");
    if (existingUser.isVerified) throw new UnprocessableEntity();
    const user = await prisma.user.update({
        where: { email: tokenData.email },
        data: { isVerified: true }
    });
    return user;
};

export const userAuth = async (userAuthData: UserAuthData) => {
    const dbUser = await findUserByEmail(userAuthData.email);
    if (!dbUser) {
        throw new NotFoundError(ErrorNames.NotFound, "User not found");
    }
    if (!dbUser.isVerified) {
        throw new BadRequestError(ErrorNames.NotVerified, "User not verified");
    }
    const isPasswordCorrect = await checkPasswordAsync(userAuthData.password, dbUser.password);
    console.log("isPasswordCorrect", isPasswordCorrect);
    if (!isPasswordCorrect) {
        throw new BadRequestError(ErrorNames.IncorrectPassword, "Password is incorrect");
    }

    const user = await prisma.user.findUnique({ where: { email: userAuthData.email } });
    //if (!user.)
    return user;
};

export const updateUser = async (id: number, data: UserData) => {
    // const todo = await Todo.findByIdAndUpdate(id, body, {
    //     new: true,
    //     runValidators: true,
    // });
    // if (!todo) throw new HttpError(400, "Item not found.");
    // return todo;
};

export const deleteUserByEmail = async (email: string) => {
    // const todo = await Todo.findByIdAndDelete(id);
    // if (!todo) throw new HttpError(400, "Item not found.");
}