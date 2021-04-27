import BadRequestError from "../../errors/BadRequestError";
import { generateGameCreateData, generateGameUpdateData, generatePlayerConnectData, getPlayersLives, getShuffledNextRoundDYPParticipants, getShuffledNextRoundParticipants, splitGameKey } from "../../helpers";
import { arrayAlreadyHasArray, shuffle } from "../../utils/arrayUtils";
import { getTournamentGames } from "../game/game.service";
import { GameData, GameInsertData, GamesResData } from "../game/game.types";
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

export const createTournamentGames = async (data: GamesCreateData): Promise<TournamentGamesData> => {
    const gameCreateData = generateGameCreateData(data.games);
    const tournament = new Tournament({ id: data.tournamentId, userId: data.userId, newGames: gameCreateData });
    return await tournament.createGames();
}

export const updateTournamentGames = async (data: GamesUpdateData): Promise<TournamentResData> => {
    const gameUpdateData = generateGameUpdateData(data.games);
    const tournament = new Tournament({ id: data.tournamentId, userId: data.userId, existingGames: gameUpdateData });
    return await tournament.updateGames();
}

export const createNextLMSRound = async (tournamentId: number, userId: number): Promise<TournamentGamesData> => {

    const tournamentForPlayers = new Tournament({ id: tournamentId, userId });
    const dbTournament = await tournamentForPlayers.getByIdForPlayers();
    const tournamentPlayerIds: number[] = dbTournament.players.map(player => player.id);
    const tournamentGames = await getTournamentGames(userId, tournamentId);
    if (!tournamentGames || tournamentGames.length === 0) {
        throw new BadRequestError();
    }
    const normalizedGames = tournamentGames.reduce((acc: { [index: string]: GameData }, val: GameData) => {
        if (!val.index) {
            return acc;
        }
        acc[val.index] = val;
        return acc;
    }, {})
    const lastRoundNumber = Object.values(normalizedGames).map(game => splitGameKey(game.index).round).sort(function (a, b) { return b - a })[0];
    const isDYP: boolean = !!normalizedGames['1-1'].player1[1]?.id && !!normalizedGames['1-1'].player2[1]?.id;

    const playerLives = getPlayersLives(tournamentGames, tournamentPlayerIds, dbTournament.numberOfLives)

    const aliveFilterCallback = (id: number) => {
        return playerLives[id] > 0
    }

    const aliveFilterCallback2D = (pair: [number, number]) => {
        return playerLives[pair[0]] > 0 && playerLives[pair[1]] > 0
    }

    // const alivePlayerIds = tournamentPlayerIds?.filter(aliveFilterCallback)

    // const waitingParticipant = lastRoundParticipants.filter(participant => {
    //     if (typeof participant.id === 'number') {
    //         return playerLives[participant.id] > 0 && 
    //     }
    // })



    // const alivePlayerCount = Object.values(playerLives).filter(val => val > 0).length;
    // if ((!isDYP && alivePlayerCount === 1) || (isDYP && alivePlayerCount === 2)) {

    // }

    let nextGames: GameInsertData[] = [];

    if (!isDYP) {

        const lastRoundParticipantIds: number[] = tournamentGames.reduce(
            (acc: number[], val) => {
                if (!val.player1 || !val.player2) {
                    return acc;
                }
                if (splitGameKey(val.index).round === lastRoundNumber) {
                    acc.push(val.player1[0].id, val.player2[0].id);
                }
                return acc;
            },
            []
        )
        const waitingParticipantIds = tournamentPlayerIds.filter(id => {
            return playerLives[id] > 0 && lastRoundParticipantIds.indexOf(id) === -1
        })
        const lastRoundAliveParticipantIds = lastRoundParticipantIds.filter(aliveFilterCallback)

        const shuffledNextRoundParticipantIds = getShuffledNextRoundParticipants(lastRoundParticipantIds, lastRoundAliveParticipantIds, waitingParticipantIds);

        nextGames = shuffledNextRoundParticipantIds.reduce((acc: GameInsertData[], val: number, i: number, arr: number[]) => {
            if (!arr[i + 1] || i % 2 === 1) {
                return acc;
            }
            acc.push({
                player1: [{ id: val }],
                player2: [{ id: arr[i + 1] }],
                index: `${lastRoundNumber + 1}-${Math.ceil((i + 1) / 2)}`
            })
            return acc;
        }, []);
    }
    else {
        const pairs = tournamentGames.reduce((acc: [number, number][], val: GameData) => {
            if (!val.index || splitGameKey(val.index).round > 1) {
                return acc;
            }
            acc.push([val.player1[0].id, val.player1[1].id], [val.player2[0].id, val.player2[1].id])
            return acc;
        }, [])

        const lastRoundParticipantIds: [number, number][] = tournamentGames.reduce(
            (acc: [number, number][], val) => {
                if (!val.player1 || !val.player2) {
                    return acc;
                }
                if (splitGameKey(val.index).round === lastRoundNumber) {
                    acc.push([val.player1[0].id, val.player1[1].id], [val.player2[0].id, val.player2[1].id]);

                }
                return acc;
            },
            []
        )

        // const notIncludedPlayers = tournamentPlayerIds.filter(id => pairs.flat().indexOf(id) === -1);

        // if (notIncludedPlayers.length === 2) {
        //     pairs.push([notIncludedPlayers[0], notIncludedPlayers[1]])
        // }

        const waitingParticipantIds: [number, number][] = pairs.filter(pair => {
            return playerLives[pair[0]] > 0 && playerLives[pair[1]] > 0 && !arrayAlreadyHasArray(lastRoundParticipantIds, pair)
        })

        const lastRoundAliveParticipantIds: [number, number][] = lastRoundParticipantIds.filter(aliveFilterCallback2D)

        // if (waitingParticipantIds) {
        //     nextRoundParticipantIds = waitingParticipantIds.concat(nextRoundParticipantIds)
        // }
        // const shuffledNextRoundParticipantIds = shuffle(nextRoundParticipantIds);
        const shuffledNextRoundParticipantIds = getShuffledNextRoundDYPParticipants(lastRoundParticipantIds, lastRoundAliveParticipantIds, waitingParticipantIds);
        nextGames = shuffledNextRoundParticipantIds.reduce((acc: GameInsertData[], val: [number, number], i: number, arr: [number, number][]) => {
            if (!arr[i + 1] || i % 2 === 1) {
                return acc;
            }
            acc.push({
                player1: [{ id: val[0] }, { id: val[1] }],
                player2: [{ id: arr[i + 1][0] }, { id: arr[i + 1][1] }],
                index: `${lastRoundNumber + 1}-${Math.ceil((i + 1) / 2)}`
            })
            return acc;
        }, []);
    }

    const gameCreateData = generateGameCreateData(nextGames);
    const tournament = new Tournament({ id: tournamentId, userId, newGames: gameCreateData });
    return await tournament.createGames();
}