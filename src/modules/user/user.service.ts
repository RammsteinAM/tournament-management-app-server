import BadRequestError from "../../../src/errors/BadRequestError";
import prisma from "../../../prisma/prisma";
import { UserAuthData, UserCreateData as UserCreationData, UserData, UserVerificationData } from "../../modules/user/user.types";
import { ErrorNames } from "../../types/errorNames";
import NotFoundError from "../../errors/NotFoundError";
import { checkPasswordAsync } from "../../utils/encryption";

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
    return await prisma.user.create({ data: userData });
};

export const verifyUser = async (data: UserVerificationData) => {
    // const user = await prisma.user.create({ data });
    // return user;
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
    
    // const user = await prisma.user.create({ data });
    // return user;
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