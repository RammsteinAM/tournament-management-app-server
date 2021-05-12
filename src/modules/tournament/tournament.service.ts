import BadRequestError from "../../errors/BadRequestError";
import { generateGameCreateData, generateGameCreateDataForImportedTournament, generateGameUpdateData, generatePlayerConnectData, getActiveTables, getInitiallyActiveTables } from "../../helpers";
import { ErrorNames } from "../../types/error";
import { getTournamentGames } from "../game/game.service";
import { GameInsertData, GamesData, TournamentGameCreateData } from "../game/game.types";
import { createPlayers, getUserPlayers } from "../player/player.service";
import { DBPlayer } from "../player/player.types";
import { generateLMSGameCreateData } from "./tournament.helpers";
import Tournament from "./tournament.model";
import { GamesCreateData, GamesUpdateData, TournamentCreateData, TournamentData, TournamentBaseData, TournamentJSONData, TournamentGamesData, TournamentResData, TournamentsNormalizedData, TournamentUpdateData } from "./tournament.types";
import Hashids from 'hashids';

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
    const dbTournament = await tournament.getById();
    if (dbTournament && dbTournament.userId !== userId) {
        throw new BadRequestError('Could\'nt get the tournament', ErrorNames.UnableToGetTournament)
    }
    return dbTournament;
};

export const getTournamentExportDataById = async (id: number, userId: number): Promise<TournamentJSONData> => {
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

export const createTournament = async (data: TournamentCreateData): Promise<TournamentResData> => {
    const gameCreateData: TournamentGameCreateData = generateGameCreateData(data.games);
    const playerConnectData = generatePlayerConnectData(data.players);
    const activeTables = getInitiallyActiveTables(data.games, data.numberOfTables);
    const tournament = new Tournament({ ...data, newGames: gameCreateData, players: playerConnectData, tablesByGameIndex: activeTables });
    const creationData = await tournament.create();
    const { id, name, userId, sets, draw, monsterDYP, tournamentTypeId, numberOfTables, tablesByGameIndex, numberOfLives, numberOfGoals, pointsForDraw, pointsForWin, games, players, createdAt, updatedAt } = creationData;
    const playerIds = players.map(val => val.id);
    const resData: TournamentResData = {
        id,
        name,
        userId,
        sets,
        draw,
        monsterDYP,
        numberOfTables,
        tablesByGameIndex,
        numberOfLives,
        numberOfGoals,
        pointsForDraw,
        pointsForWin,
        games,
        tournamentTypeId,
        createdAt,
        updatedAt,
        players: playerIds
    }
    return resData;
}

export const importTournament = async (data: TournamentJSONData & { userId: number }): Promise<TournamentData> => {
    const userPlayers = await getUserPlayers(data.userId);
    const userPlayerNames = userPlayers.map(p => p.name);
    try {
        const importedPlayers = data.games.reduce((acc: { [name: string]: number }, game) => {
            const p1_0 = game.player1[0];
            const p2_0 = game.player2[0];
            const p1_1 = game.player1[1];
            const p2_1 = game.player2[1];
            if (p1_0 && p1_0.name && p1_0.id) {
                acc[p1_0.name] = p1_0.id
            }
            if (p2_0 && p2_0.name && p2_0.id) {
                acc[p2_0.name] = p2_0.id
            }
            if (p1_1 && p2_1 && p1_1.name && p2_1.name && p1_1.id && p2_1.id) {
                acc[p1_1.name] = p1_1.id
                acc[p2_1.name] = p2_1.id
            }
            return acc;
        }, {});

        const missingPlayers = Object.keys(importedPlayers).filter(name => !userPlayerNames.includes(name));

        const createdPlayers = missingPlayers.length > 0 ? await createPlayers(missingPlayers, data.userId) : [];
        const allPlayers = [...userPlayers, ...createdPlayers];
        const normalizedTournamentPlayers = allPlayers.reduce((acc: { [name: string]: number }, val) => {
            const { name, id } = val;
            if (importedPlayers[name]) {
                acc[name] = id
            }
            return acc;
        }, {});

        const gameDataWithNewPlayerIds: GameInsertData[] = data.games.map(game => {
            const player1Data: DBPlayer = []
            const player2Data: DBPlayer = []
            if (game.player1 && game.player1[0]?.id) {
                player1Data.push({ id: game.player1[0].id })
                if (game.player1[1]?.id) {
                    player1Data.push({ id: game.player1[1].id })
                }
            }
            if (game.player2 && game.player2[0]?.id) {
                player2Data.push({ id: game.player2[0].id })
                if (game.player2[1]?.id) {
                    player2Data.push({ id: game.player2[1].id })
                }
            }
            const gameData: GameInsertData = {
                index: game.index,
                scores1: [...game.scores1],
                scores2: [...game.scores2],
                player1: player1Data,
                player2: player2Data,
                hasByePlayer: game.hasByePlayer,
            }

            const p1_0 = game.player1[0];
            const p2_0 = game.player2[0];
            const p1_1 = game.player1[1];
            const p2_1 = game.player2[1];

            if (p1_0 && p1_0.name && p1_0.id) {
                gameData.player1[0].id = normalizedTournamentPlayers[p1_0.name]
            }
            if (p2_0 && p2_0.name && p2_0.id) {
                gameData.player2[0].id = normalizedTournamentPlayers[p2_0.name]
            }
            if (p1_1 && p2_1 && p1_1.name && p1_1.id && p2_1.name && p2_1.id) {
                gameData.player1[1].id = normalizedTournamentPlayers[p1_1.name]
                gameData.player2[1].id = normalizedTournamentPlayers[p2_1.name]
            }

            return gameData;
        })

        const gameCreateData: TournamentGameCreateData = generateGameCreateDataForImportedTournament(gameDataWithNewPlayerIds);

        const playerConnectData = generatePlayerConnectData(Object.values(normalizedTournamentPlayers));
        const activeTables = getInitiallyActiveTables(data.games, data.numberOfTables);
        const tournament = new Tournament({ ...data, newGames: gameCreateData, players: playerConnectData, tablesByGameIndex: activeTables });
        return await tournament.create();
    } catch (error) {
        throw new BadRequestError('Error importing tournament', ErrorNames.ImportTournamentFailed)
    }

}

export const updateTournament = async (data: TournamentUpdateData): Promise<TournamentData> => {
    const tournament = new Tournament(data);
    return await tournament.updateById();
};

export const deleteTournament = async (data: TournamentBaseData): Promise<void> => {
    const tournament = new Tournament(data);
    await tournament.deleteById();
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

export const getTournamentForViewing = async (shareId: string): Promise<TournamentData> => {
    const tournament = new Tournament({ shareId, userId: null });
    return await tournament.getForView();
};


export const giveTournamentShareAccess = async ({ id, userId }: TournamentBaseData): Promise<{ shareId: string }> => {
    const hashids = new Hashids('', 15);
    const hashValue = new Date().getTime() + id;
    const shareId = hashids.encode(hashValue);
    const tournament = new Tournament({ id, userId, shareId });
    await tournament.updateById();
    return { shareId };
}

export const revokeTournamentShareAccess = async ({ id, userId }: TournamentBaseData): Promise<void> => {
    const tournament = new Tournament({ id, userId, shareId: null });
    await tournament.updateById();
}