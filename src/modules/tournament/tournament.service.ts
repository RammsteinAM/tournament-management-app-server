import BadRequestError from "../../errors/BadRequestError";
import { generateGameCreateData, generateGameUpdateData, generatePlayerConnectData, getActiveTables, getInitiallyActiveTables, splitGameKey } from "../../helpers";
import { arrayAlreadyHasArray, shuffle } from "../../utils/arrayUtils";
import { getTournamentGames } from "../game/game.service";
import { GameData, GameInsertData, GamesData, GamesResData, TournamentGameCreateData } from "../game/game.types";
import { generateLMSGameCreateData, getPlayersLives, getShuffledNextRoundDYPParticipants, getShuffledNextRoundParticipants } from "./tournament.helpers";
import Tournament from "./tournament.model";
import { GamesCreateData, GamesUpdateData, LMSPlayer, LMSPlayers, TournamentCreateData, TournamentData, TournamentDeleteData, TournamentExportData, TournamentExportResData, TournamentGamesData, TournamentResData, TournamentsNormalizedData, TournamentUpdateData } from "./tournament.types";

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

export const getTournamentExportDataById = async (id: number, userId: number): Promise<TournamentExportData> => {
    const tournament = new Tournament({ id, userId });
    return await tournament.getExportDataById();
};

export const getTournamentTypeId = async (id: number, userId: number): Promise<TournamentData> => {
    const tournament = new Tournament({ id, userId });
    return await tournament.getById();
};

export const getTournamentPlayers = async (id: number, userId: number): Promise<TournamentData> => {
    const tournament = new Tournament({ id, userId });
    return await tournament.getById();
};

export const createTournament = async (data: TournamentCreateData): Promise<TournamentData> => {
    const gameCreateData: TournamentGameCreateData = generateGameCreateData(data.games);
    const playerConnectData = generatePlayerConnectData(data.players);
    const activeTables = getInitiallyActiveTables(data.games, data.numberOfTables);
    const tournament = new Tournament({ ...data, newGames: gameCreateData, players: playerConnectData, tablesByGameIndex: activeTables });
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

export const createTournamentGames = async (data: GamesCreateData): Promise<TournamentGamesData> => {
    const gameCreateData = generateGameCreateData(data.games);
    const tournament = new Tournament({ id: data.tournamentId, userId: data.userId, newGames: gameCreateData });
    return await tournament.createGames();
}

export const updateTournamentGames = async (data: GamesUpdateData, tournamentGames: GamesData, mainGameIndex: string): Promise<TournamentResData> => {
    const gameUpdateData = generateGameUpdateData(data.games);
    const tournament = new Tournament({ id: data.tournamentId, userId: data.userId, existingGames: gameUpdateData });
    const tournamentData = await tournament.getById();
    const activeTables = getActiveTables(tournamentGames, mainGameIndex, tournamentData.tablesByGameIndex);
    tournament.tablesByGameIndex = activeTables;
    return await tournament.updateGames();
}

export const createNextLMSRound = async (tournamentId: number, userId: number): Promise<TournamentGamesData> => {
    const tournamentForPlayers = new Tournament({ id: tournamentId, userId });
    const dbTournament = await tournamentForPlayers.getByIdForPlayers();

    const tournamentGames = await getTournamentGames(userId, tournamentId);
    if (!tournamentGames || tournamentGames.length === 0) {
        throw new BadRequestError();
    }

    const newGames = generateLMSGameCreateData(tournamentGames, dbTournament);

    const tournament = new Tournament({ id: tournamentId, userId, newGames });
    return await tournament.createGames();
}