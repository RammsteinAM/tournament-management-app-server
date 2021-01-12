import BadRequestError from "../../../src/errors/BadRequestError";
import prisma from "../../../prisma/prisma";
import { DecodedTokenData, UserAuthData, UserCreateData as UserCreationData, UserData, UserVerificationData } from "../../modules/user/user.types";
import NotFoundError from "../../errors/NotFoundError";
import { checkPasswordAsync } from "../../utils/encryption";
import User from "./user.model";

export const getUserById = async (id: any): Promise<UserData> => {
    const user = new User({ id });
    return await user.getUserById();
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