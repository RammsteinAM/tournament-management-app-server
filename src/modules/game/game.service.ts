import BadRequestError from "../../../src/errors/BadRequestError";
import { generateGameUpdateData, getMultipleSetScores, getNextGameKey, getParentsData, splitGameKey } from "../../helpers";
import { updateTournamentGames } from "../tournament/tournament.service";
import { GamesCreateData, GamesUpdateData, TournamentResData } from "../tournament/tournament.types";
import Game from "./game.model";
import { GameCreateData, GameData, GamesData, GamesResData, GameUpdateData, GameUpdateDataForMultipleGames } from "./game.types";

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

export const updateGame = async (data: GameUpdateData, id: number): Promise<GameData> => {
    const game = new Game({ ...data, id });
    const updatedGame = await game.updateById();
    return updatedGame;
};

export const updateGameAndNextGames = async (data: GameUpdateData, gameId: number, userId: number): Promise<TournamentResData> => {
    const game = new Game({ ...data, id: gameId });

    // const updatedGame = await game.updateById();
    const dbGame = await game.getById();

    const tournamentGames = await getTournamentGames(userId, dbGame.tournamentId);
    const normalizedGames = tournamentGames.reduce((acc: { [index: string]: GameData }, val: GameData) => {
        if (!val.index) {
            return acc;
        }
        acc[val.index] = val;
        return acc;
    }, {})
    const finalRoundNumber = Object.values(normalizedGames).map(game => splitGameKey(game.index).round).sort(function (a, b) { return b - a })[0];
    const isGameOdd = splitGameKey(dbGame.index).gameNumber % 2 === 1;    
    const round = splitGameKey(dbGame.index).round;
    const { score1, score2 } = getMultipleSetScores(data.scores1, data.scores2, Object.keys(data.scores1).length);

    const winner = score1 > score2 ? dbGame.player1 : dbGame.player2;
    const loser = score1 > score2 ? dbGame.player2 : dbGame.player1;

    const initialGameUpdateData: GameUpdateDataForMultipleGames = {
        id: dbGame.id,
        player1: data.player1,
        player2: data.player2,
        scores1: data.scores1,
        scores2: data.scores2,
        hasByePlayer: data.hasByePlayer
    }

    const gamesData: GameUpdateDataForMultipleGames[] = [initialGameUpdateData];
    
    const nextGameKey = getNextGameKey(dbGame.index, finalRoundNumber);

    function updateNextGame(gameKey: string, isGameOdd: boolean) {
        const parentGamesData = getParentsData(gameKey, normalizedGames);
        const nextGameKey = getNextGameKey(gameKey, finalRoundNumber);
        const gameNumber = splitGameKey(gameKey).gameNumber;
        const isNextGameOdd = !isNaN(gameNumber) ? gameNumber % 2 === 1 : true;
        let hasByePlayer = false;
        if (parentGamesData.round === 2 && (parentGamesData.parent1HasNoPlayer || parentGamesData.parent2HasNoPlayer)) {
            hasByePlayer = true;
        }
        else if ((parentGamesData.parent1HasByePlayer || parentGamesData.parent2HasByePlayer) && (parentGamesData.parent1HasNoPlayer || parentGamesData.parent2HasNoPlayer)) {
            hasByePlayer = true;
        }
        const game = normalizedGames[gameKey];
        if (isGameOdd) {
            const gameData: GameUpdateDataForMultipleGames = {
                id: game.id,
                player1: winner,
                hasByePlayer
            }
            gamesData.push(gameData)
            if (round === finalRoundNumber - 1 && normalizedGames['thirdPlace']) {
                const thirdPlaceGameData: GameUpdateDataForMultipleGames = {
                    id: normalizedGames['thirdPlace'].id,
                    player1: loser ? [...loser] : undefined,
                    hasByePlayer: parentGamesData.numberOfParentPlayers < 4
                }
                gamesData.push(thirdPlaceGameData)
            }
        }
        else {
            const gameData: GameUpdateDataForMultipleGames = {
                id: game.id,
                player2: winner,
                hasByePlayer
            }
            gamesData.push(gameData)
            if (round === finalRoundNumber - 1 && normalizedGames['thirdPlace']) {
                const thirdPlaceGameData: GameUpdateDataForMultipleGames = {
                    id: normalizedGames['thirdPlace'].id,
                    player2: loser ? [...loser] : undefined,
                    hasByePlayer: parentGamesData.numberOfParentPlayers < 4
                }
                gamesData.push(thirdPlaceGameData)
            }
        }

        if (!nextGameKey) {
            return;
        }
        if (hasByePlayer) {
            updateNextGame(nextGameKey, isNextGameOdd);
            return;
        }
        if (!game.scores1 || !game.scores2 || game.scores1.length === 0 || game.scores2.length === 0) {
            return;
        }
        if ((game.scores1?.length === 0 || game.scores2?.length === 0) && (!parentGamesData.parent1HasByePlayer && !parentGamesData.parent2HasByePlayer)) {
            return;
        }

        if (game.player1 && game.player2 && game.scores1 && winner && loser && game.scores2 && game.scores1.length > 0 && game.scores2.length > 0) {
            const score1 = getMultipleSetScores(game.scores1, game.scores2, Object.keys(game.scores1).length).score1;
            const score2 = getMultipleSetScores(game.scores1, game.scores2, Object.keys(game.scores1).length).score2;
            const p1JSON = JSON.stringify(game.player1);
            const p2JSON = JSON.stringify(game.player2);
            const winnerJSON = JSON.stringify(winner);
            const loserJSON = JSON.stringify(loser);

            if (
                (score1 < score2 && (p1JSON === winnerJSON || p1JSON === loserJSON)) ||
                (score1 > score2 && (p2JSON === winnerJSON || p2JSON === loserJSON))
            ) {
                return; // Prevent updating next game if the updated player lost this game.
            }
        }
        updateNextGame(nextGameKey, isNextGameOdd);
    }
    nextGameKey && updateNextGame(nextGameKey, isGameOdd);
    const updatedTournament = await updateTournamentGames({tournamentId: dbGame.tournamentId, userId, games: gamesData})


    return updatedTournament;
};

export const deleteGameById = async (id: number) => {
    // const todo = await Todo.findByIdAndDelete(id);
    // if (!todo) throw new HttpError(400, "Item not found.");
}