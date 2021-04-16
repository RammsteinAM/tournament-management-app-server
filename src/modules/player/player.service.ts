import BadRequestError from "../../../src/errors/BadRequestError";
import { UserEditRequestData } from "../auth/auth.types";
import Player from "./player.model";
import Players from "./players.model";
import { ErrorNames } from "../../types/error";
import { PlayerCreateData, PlayerData } from "./player.types";

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
    const player = new Players({ userId });
    const existingPlayers = await getUserPlayers(userId);
    const existingPlayerNames = existingPlayers.map(p => p.name);
    const newPlayerNames = names.filter(name => (name && existingPlayerNames.indexOf(name) === -1));
    player.names = newPlayerNames;
    const updatedUserData = await player.createMany();
    return updatedUserData.players;
}

export const updatePlayer = async (id: number, { displayName, currentPassword, password }: UserEditRequestData): Promise<PlayerData> => {
    const tournament = new Player({ id, userId: 1 /* userId */ });
    const updatedUser = await tournament.updateById();
    return updatedUser;
};

export const deletePlayerById = async (id: number) => {
    // const todo = await Todo.findByIdAndDelete(id);
    // if (!todo) throw new HttpError(400, "Item not found.");
}