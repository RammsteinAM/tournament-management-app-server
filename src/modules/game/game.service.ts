import BadRequestError from "../../../src/errors/BadRequestError";
import Game from "./game.model";
import { GameCreateData, GameData, GamesData, GameUpdateData } from "./game.types";

export const getTournamentGames = async (userId: number, tournamentId: number): Promise<GamesData> => {
    if (!tournamentId) {
        throw new BadRequestError('Invalid Tournament ID');
    }
    const game = new Game({ userId, tournamentId });
    return await game.getTournamentGames();
};

export const getGameById = async (id: number, userId: number): Promise<GameData> => {
    const game = new Game({ id, userId });
    return await game.getById();
};

export const createGame = async ({ userId, tournamentId }: GameCreateData): Promise<GameData> => {
    const game = new Game({ userId, tournamentId });
    // const playerFound = await game.getById();
    // if (playerFound) throw new BadRequestError('Player with the given name already exists.', ErrorNames.DuplicatePlayerName);
    return await game.create();
}

export const updateGame = async (data: GameUpdateData): Promise<GameData> => {
    const game = new Game({...data});
    const updatedUser = await game.updateById();
    return updatedUser;
};

export const deleteGameById = async (id: number) => {
    // const todo = await Todo.findByIdAndDelete(id);
    // if (!todo) throw new HttpError(400, "Item not found.");
}