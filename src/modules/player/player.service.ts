import BadRequestError from "../../../src/errors/BadRequestError";
import { UserData, UserEditRequestData } from "../auth/auth.types";
import { checkPasswordAsync, encryptPasswordAsync } from "../../utils/encryption";
import Player from "./player.model";
import UnauthorizedError from "../../errors/UnauthorizedError";
import { createToken } from "../../utils/jwtTokenUtils";
import { TokenDurationFor } from "../../types/main";
import { generatePasswordResetEmail, sendEmail } from "../../utils/emailUtils";
import { ErrorNames } from "../../types/error";
import { PlayerCreateData, PlayerData, Players } from "./player.types";
import prisma from "../../../prisma/prisma";

export const getUserPlayers = async (userId: number): Promise<PlayerData[]> => {
    const players = new Player({ userId });
    return await players.getUserPlayers();
};

export const getPlayerById = async (id: number, userId: number): Promise<PlayerData> => {
    const player = new Player({ id, userId });
    return await player.getById();
};

export const createPlayer = async ({ userId, name }: PlayerCreateData): Promise<PlayerData> => {
    const player = new Player({ userId, name });
    const playerFound = await player.getByName();
    if (playerFound) throw new BadRequestError('Player with the given name already exists.', ErrorNames.DuplicatePlayerName);
    return await player.create();
}

export const createPlayers = async (names: string[], userId: number): Promise<PlayerData[]> => {
    const player = new Player({ userId });
    //player.players = names.map(name => ({ name, userId }));
    const existingPlayers = await getUserPlayers(userId);
    const existingPlayerNames = existingPlayers.map(player => player.name);
    const newPlayerNames = names.filter(name => (name && existingPlayerNames.indexOf(name) < 0));
    player.names = newPlayerNames;
    const playerFound = await player.getByName();
    // if (playerFound) throw new BadRequestError('Player with the given name already exists.', ErrorNames.DuplicatePlayerName);
    const updatedUserData = await player.createMany();
    return updatedUserData.players;
    //return await getUserPlayers(userId);
}

export const updatePlayer = async (id: number, { displayName, currentPassword, password }: UserEditRequestData): Promise<PlayerData> => {
    // let encryptedPassword: string = null;
    // if (currentPassword) {
    //     encryptedPassword = await encryptPasswordAsync(password);
    // }
    const tournament = new Player({ id, userId: 1 /* userId */ });
    // const dbUser = await user.getById();
    // if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);

    // if (currentPassword) {
    //     const isPasswordCorrect = await checkPasswordAsync(currentPassword, dbUser.password);
    //     if (!isPasswordCorrect) throw new UnauthorizedError("Password is incorrect", ErrorNames.WrongPassword);
    // }

    const updatedUser = await tournament.updateById();
    return updatedUser;
};

export const deletePlayerById = async (id: number) => {
    // const todo = await Todo.findByIdAndDelete(id);
    // if (!todo) throw new HttpError(400, "Item not found.");
}