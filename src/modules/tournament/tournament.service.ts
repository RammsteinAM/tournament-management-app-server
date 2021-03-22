import BadRequestError from "../../../src/errors/BadRequestError";
import { UserData, UserEditRequestData } from "../auth/auth.types";
import { checkPasswordAsync, encryptPasswordAsync } from "../../utils/encryption";
import Tournament from "./tournament.model";
import UnauthorizedError from "../../errors/UnauthorizedError";
import { createToken } from "../../utils/jwtTokenUtils";
import { TokenDurationFor } from "../../types/main";
import { generatePasswordResetEmail, sendEmail } from "../../utils/emailUtils";
import { ErrorNames } from "../../types/error";
import { TournamentCreateData, TournamentData, Tournaments } from "./tournament.types";

export const getUserTournaments = async (userId: number): Promise<TournamentData[]> => {
    const tournament = new Tournament({ userId });
    return await tournament.getAll();
};

export const getTournamentById = async (id: number, userId: number): Promise<TournamentData> => {
    const tournament = new Tournament({ id, userId });
    return await tournament.getById();
};

export const getTournamentTypeId = async (id: number, userId: number): Promise<TournamentData> => {
    const tournament = new Tournament({ id, userId });
    return await tournament.getById();
};

export const createTournament = async (data: TournamentCreateData): Promise<TournamentData> => {
    const tournament = new Tournament(data);
    return await tournament.create();
}

export const updateTournament = async (id: number, { displayName, currentPassword, password }: UserEditRequestData): Promise<TournamentData> => {
    // let encryptedPassword: string = null;
    // if (currentPassword) {
    //     encryptedPassword = await encryptPasswordAsync(password);
    // }
    const tournament = new Tournament({ id, userId: 1 /* userId */ });
    // const dbUser = await user.getById();
    // if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);

    // if (currentPassword) {
    //     const isPasswordCorrect = await checkPasswordAsync(currentPassword, dbUser.password);
    //     if (!isPasswordCorrect) throw new UnauthorizedError("Password is incorrect", ErrorNames.WrongPassword);
    // }

    const updatedUser = await tournament.updateById();
    return updatedUser;
};

export const deleteTournamentByEmail = async (email: string) => {
    // const todo = await Todo.findByIdAndDelete(id);
    // if (!todo) throw new HttpError(400, "Item not found.");
}