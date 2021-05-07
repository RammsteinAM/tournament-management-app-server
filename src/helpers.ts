import { GameCreateConnectionData, GameInsertData, GamesData, GameUpdateDataForMultipleGames, GameUpdateSetData, GameUpdateSetDataWithId, NormalizedGamesData, TournamentGameCreateData, TournamentGameUpdateData } from "./modules/game/game.types";
import { TournamentCreateData, TournamentPlayerConnectData } from "./modules/tournament/tournament.types";
import { shuffle } from "./utils/arrayUtils";
import { thirdPlaceIndex } from "./utils/constants";

interface GameKeyParts {
    round: number;
    gameNumber: number;
}

export const generatePlayerConnectData = (playerIds: number[]) => {
    const playerConnectionData = playerIds?.map(id => {
        return { id };
    });
    const gameCreateData: TournamentPlayerConnectData = playerConnectionData ? { connect: playerConnectionData } : undefined;
    return gameCreateData;
}

export const generateGameCreateData = (games: GameInsertData[]) => {
    const gameConnectionData: GameCreateConnectionData[] | undefined = (games && games.length > 0) ? games.map(game => {
        const player1ConnectData = [];
        const player2ConnectData = [];
        if (game.player1 && game.player1[0]?.id) {
            player1ConnectData.push(game.player1[0]);
        }
        if (game.player2 && game.player2[0]?.id) {
            player2ConnectData.push(game.player2[0]);
        }
        if (game.player1 && game.player2 && game.player1[1]?.id && game.player2[1]?.id) {
            player1ConnectData.push(game.player1[1]);
            player2ConnectData.push(game.player2[1]);
        }
        const result: GameCreateConnectionData = { index: game.index };
        if (player1ConnectData.length > 0) {
            result.player1 = { connect: player1ConnectData }
        }
        if (player2ConnectData.length > 0) {
            result.player2 = { connect: player2ConnectData }
        }
        result.hasByePlayer = game.hasByePlayer;
        return result;
    }) : undefined;
    const gameCreateData: TournamentGameCreateData = gameConnectionData ? { create: gameConnectionData } : undefined;
    return gameCreateData;
}

export const generateGameCreateDataForImportedTournament = (games: GameInsertData[]) => {
    const gameConnectionData: GameCreateConnectionData[] | undefined = (games && games.length > 0) ? games.map(game => {
        const player1ConnectData = [];
        const player2ConnectData = [];
        if (game.player1 && game.player1[0]?.id) {
            player1ConnectData.push(game.player1[0]);
        }
        if (game.player2 && game.player2[0]?.id) {
            player2ConnectData.push(game.player2[0]);
        }
        if (game.player1 && game.player2 && game.player1[1]?.id && game.player2[1]?.id) {
            player1ConnectData.push(game.player1[1]);
            player2ConnectData.push(game.player2[1]);
        }
        const result: GameCreateConnectionData = { index: game.index };
        result.scores1 = [...game.scores1];
        result.scores2 = [...game.scores2];
        if (player1ConnectData.length > 0) {
            result.player1 = { connect: player1ConnectData }
        }
        if (player2ConnectData.length > 0) {
            result.player2 = { connect: player2ConnectData }
        }
        result.hasByePlayer = game.hasByePlayer;
        return result;
    }) : undefined;
    const gameCreateData: TournamentGameCreateData = gameConnectionData ? { create: gameConnectionData } : undefined;
    return gameCreateData;
}

export const getMultipleSetScores = (scores1: number[], scores2: number[]): { score1: number, score2: number, winners: number[] } => {
    let score1 = scores1[0], score2 = scores2[0];
    const winners: number[] = [];
    if (scores1.length > 1) {
        score1 = 0;
        score2 = 0;
        for (let i = 0; i <= scores1.length; i++) {
            const subScore1 = scores1[i];
            const subScore2 = scores2[i];
            if (subScore1 > subScore2) {
                score1++;
                winners.push(1);
            }
            if (subScore1 < subScore2) {
                score2++;
                winners.push(2);
            }
        }
    }
    return { score1, score2, winners };
}

export const splitGameKey = (gameKey: string): GameKeyParts => {
    if (gameKey === thirdPlaceIndex) {
        return { round: -1, gameNumber: -1 };
    }
    return { round: parseInt(gameKey.split('-')[0]), gameNumber: parseInt(gameKey.split('-')[1]) };
}

export const getParentsData = (gameKey: string, games: NormalizedGamesData) => {
    const round = splitGameKey(gameKey).round;
    const gameNumber = splitGameKey(gameKey).gameNumber;
    const parent1GameKey = `${round - 1}-${gameNumber * 2 - 1}`;
    const parent2GameKey = `${round - 1}-${gameNumber * 2}`;
    const data = {
        p1p1: games[parent1GameKey]?.player1,
        p1p2: games[parent1GameKey]?.player2,
        parent1HasByePlayer: games[parent1GameKey]?.hasByePlayer,
        parent1HasNoPlayer: !games[parent1GameKey]?.player1?.[0]?.id && !games[parent1GameKey]?.player2?.[0]?.id,
        p2p1: games[parent2GameKey]?.player1,
        p2p2: games[parent2GameKey]?.player2,
        parent2HasByePlayer: games[parent2GameKey]?.hasByePlayer,
        parent2HasNoPlayer: !games[parent2GameKey]?.player1?.[0]?.id && !games[parent2GameKey]?.player2?.[0]?.id,
        numberOfParentPlayers: Number(!!games[parent1GameKey]?.player1?.[0]?.id) + Number(!!games[parent1GameKey]?.player2?.[0]?.id) + Number(!!games[parent2GameKey]?.player1?.[0]?.id) + Number(!!games[parent2GameKey]?.player2?.[0]?.id),
        round
    };
    return data;
}

export const getNextGameKey = (gameKey: string, finalRoundNumber: number): string | null => {
    const round = splitGameKey(gameKey).round;
    if (round === -1) {
        return null;
    }
    const gameNumber = splitGameKey(gameKey).gameNumber;
    const isGameOdd = gameNumber % 2 === 1;
    const nextGameKey = round <= finalRoundNumber - 1 ?
        `${round + 1}-${isGameOdd ? (gameNumber + 1) / 2 : gameNumber / 2}` : null;
    return nextGameKey;
}

export const generateGameUpdateData = (games: GameUpdateDataForMultipleGames[]) => {
    const gamesSetData: GameUpdateSetDataWithId[] | undefined = (games && games.length > 0) ? games.map(game => {
        const player1SetData = [];
        const player2SetData = [];
        if (game.player1 && game.player1[0]?.id) player1SetData.push(game.player1[0]);
        if (game.player1 && game.player1[1]?.id) player1SetData.push(game.player1[1]);
        if (game.player2 && game.player2[0]?.id) player2SetData.push(game.player2[0]);
        if (game.player2 && game.player2[1]?.id) player2SetData.push(game.player2[1]);
        const result: GameUpdateSetDataWithId = { where: { id: game.id }, data: {} };
        if (player1SetData.length > 0) {
            result.data.player1 = { set: player1SetData }
        }
        if (player2SetData.length > 0) {
            result.data.player2 = { set: player2SetData }
        }
        result.data.scores1 = game.scores1;
        result.data.scores2 = game.scores2;
        result.data.hasByePlayer = game.hasByePlayer;
        return result;
    }) : undefined;
    const gameUpdateData: TournamentGameUpdateData = gamesSetData ? { update: gamesSetData } : undefined;
    return gameUpdateData;
}

export const getInitiallyActiveTables = (games: GameInsertData[], numberOfTables: number): { [index: string]: number } => {
    const gameIndexesToBePlayed = games.reduce((acc: string[], game) => {
        if (game.hasByePlayer || !game.player1 || !game.player2) {
            return acc;
        }
        if (game.player1[0]?.id && game.player2[0]?.id && (!game.scores1 || game.scores1.length === 0) && (!game.scores2 || game.scores2.length === 0)) {
            acc.push(game.index)
        }
        return acc;
    }, []).sort();


    if (gameIndexesToBePlayed[gameIndexesToBePlayed.length - 1] === thirdPlaceIndex) {
        gameIndexesToBePlayed[gameIndexesToBePlayed.length - 1] = gameIndexesToBePlayed[gameIndexesToBePlayed.length - 2];
        gameIndexesToBePlayed[gameIndexesToBePlayed.length - 2] = thirdPlaceIndex;
    }

    const activeTables: { [index: string]: number } = gameIndexesToBePlayed
        .slice(0, numberOfTables)
        .reduce((acc: { [index: string]: number }, val, i) => {
            acc[val] = i + 1;
            return acc;
        }, {});
    return activeTables;
}

export const getActiveTables = (games: GamesData, gameIndex: string, tablesByGameIndex: { [index: string]: number }): { [index: string]: number } => {
    if (!tablesByGameIndex[gameIndex]) {
        // If updating a game that has no active table assigned.
        return tablesByGameIndex;
    }

    const gameIndexesToBePlayed = games.reduce((acc: string[], game) => {
        if (game.hasByePlayer) {
            return acc;
        }
        if (!game.scores1 || !game.scores2 || game.scores1.length === 0 || game.scores2.length === 0) {
            acc.push(game.index)
        }
        return acc;
    }, []).sort();

    if (gameIndexesToBePlayed[gameIndexesToBePlayed.length - 1] === thirdPlaceIndex) {
        gameIndexesToBePlayed[gameIndexesToBePlayed.length - 1] = gameIndexesToBePlayed[gameIndexesToBePlayed.length - 2];
        gameIndexesToBePlayed[gameIndexesToBePlayed.length - 2] = thirdPlaceIndex;
    }

    const unassignedGameIndexesToBePlayed = gameIndexesToBePlayed.filter(index => {
        return !tablesByGameIndex[index];
    });

    const newTablesByGameIndex = { ...tablesByGameIndex }

    delete newTablesByGameIndex[gameIndex];
    if (unassignedGameIndexesToBePlayed[0]) {
        newTablesByGameIndex[unassignedGameIndexesToBePlayed[0]] = tablesByGameIndex[gameIndex];
    }

    return newTablesByGameIndex;
}