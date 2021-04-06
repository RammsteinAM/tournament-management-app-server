import { generateGameCreateData } from "../../helpers";
import { GamesData, GamesResData, TournamentGameCreateData } from "../game/game.types";
import Tournament from "./tournament.model";
import { GamesCreateData, TournamentCreateData, TournamentData, TournamentDeleteData, TournamentsNormalizedData, TournamentUpdateData } from "./tournament.types";

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
    const tournament = new Tournament({ ...data, games: gameCreateData });
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
    const tournament = new Tournament({ id: data.tournamentId, userId: data.userId, games: gameCreateData });
    return await tournament.createGames();
}