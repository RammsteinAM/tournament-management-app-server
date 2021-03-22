import BadRequestError from "../../../src/errors/BadRequestError";
import { UserData, UserEditRequestData } from "../auth/auth.types";
import { checkPasswordAsync, encryptPasswordAsync } from "../../utils/encryption";
import Game from "./game.model";
import UnauthorizedError from "../../errors/UnauthorizedError";
import { createToken } from "../../utils/jwtTokenUtils";
import { TokenDurationFor } from "../../types/main";
import { generatePasswordResetEmail, sendEmail } from "../../utils/emailUtils";
import { ErrorNames } from "../../types/error";
import { GameCreateData, GameData, GamesData, GamesCreateData } from "./game.types";
import prisma from "../../../prisma/prisma";

export const getTournamentGames = async (userId: number): Promise<GameData[]> => {
    const game = new Game({ userId });
    return await game.getTournamentGames();
};

export const getGameById = async (id: number, userId: number): Promise<GameData> => {
    const player = new Game({ id, userId });
    return await player.getById();
};

export const createGame = async ({ userId, tournamentId }: GameCreateData): Promise<GameData> => {
    const game = new Game({ userId, tournamentId });
    // const playerFound = await game.getById();
    // if (playerFound) throw new BadRequestError('Player with the given name already exists.', ErrorNames.DuplicatePlayerName);
    return await game.create();
}

export const createGames = async ({userId, tournamentId}: GamesCreateData/* , userId: number */): Promise<GameData[]> => {
    const game = new Game({ userId, tournamentId });
    //player.players = names.map(name => ({ name, userId }));
    // const existingPlayers = await getUserGames(userId);
    // const existingPlayerNames = existingPlayers.map(player => player.name);
    // const newPlayerNames = names.filter(name => (name && existingPlayerNames.indexOf(name) < 0));
    // game.names = newPlayerNames;
    // const playerFound = await game.getByName();
    // if (playerFound) throw new BadRequestError('Player with the given name already exists.', ErrorNames.DuplicatePlayerName);
    const updatedTournamentData = await game.createMany();
    return updatedTournamentData.games;
    //return await getUserPlayers(userId);
}

export const updateGame = async (id: number, { displayName, currentPassword, password }: UserEditRequestData): Promise<GameData> => {
    // let encryptedPassword: string = null;
    // if (currentPassword) {
    //     encryptedPassword = await encryptPasswordAsync(password);
    // }
    const game = new Game({ id, userId: 1, tournamentId: 1 /* userId */ });
    // const dbUser = await user.getById();
    // if (!dbUser) throw new BadRequestError("User not found", ErrorNames.UserNotFound);

    // if (currentPassword) {
    //     const isPasswordCorrect = await checkPasswordAsync(currentPassword, dbUser.password);
    //     if (!isPasswordCorrect) throw new UnauthorizedError("Password is incorrect", ErrorNames.WrongPassword);
    // }

    const updatedUser = await game.updateById();
    return updatedUser;
};

export const deleteGameById = async (id: number) => {
    // const todo = await Todo.findByIdAndDelete(id);
    // if (!todo) throw new HttpError(400, "Item not found.");
}