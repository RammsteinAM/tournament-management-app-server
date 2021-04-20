import { generateGameCreateData, generateGameUpdateData, generatePlayerConnectData } from "../../helpers";
import { GamesResData } from "../game/game.types";
import Tournament from "./tournament.model";
import { GamesCreateData, GamesUpdateData, TournamentCreateData, TournamentData, TournamentDeleteData, TournamentResData, TournamentsNormalizedData, TournamentUpdateData } from "./tournament.types";

export const getUserTournaments = async (userId: number): Promise<TournamentsNormalizedData> => {
    const tournament = new Tournament({ userId });
    const tournamentsArr = await tournament.getAll();
    const normalizedTournaments: TournamentsNormalizedData = tournamentsArr.reduce((acc: TournamentsNormalizedData, val: TournamentData) => {
        acc[val.id] = val;
        return acc;
    }, {});
    return normalizedTournaments;
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
    const gameCreateData = generateGameCreateData(data.games);
    const playerConnectData = generatePlayerConnectData(data.players);
    const tournament = new Tournament({ ...data, newGames: gameCreateData, players: playerConnectData });
    return await tournament.create();
}

export const updateTournament = async (data: TournamentUpdateData): Promise<TournamentData> => {
    const tournament = new Tournament(data);
    return await tournament.updateById();
};

export const deleteTournament = async (data: TournamentDeleteData): Promise<{ id: number }> => {
    const tournament = new Tournament(data);
    return await tournament.deleteById();
}

export const createTournamentGames = async (data: GamesCreateData): Promise<GamesResData> => {
    const gameCreateData = generateGameCreateData(data.games);
    const tournament = new Tournament({ id: data.tournamentId, userId: data.userId, newGames: gameCreateData });
    return await tournament.createGames();
}

export const updateTournamentGames = async (data: GamesUpdateData): Promise<TournamentResData> => {
    const gameUpdateData = generateGameUpdateData(data.games);
    const tournament = new Tournament({ id: data.tournamentId, userId: data.userId, existingGames: gameUpdateData });
    return await tournament.updateGames();
}