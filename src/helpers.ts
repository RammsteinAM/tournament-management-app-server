import { GameCreateConnectionData, GameInsertData, GameUpdateConnectionData, TournamentGameCreateData, TournamentGameUpdateData } from "./modules/game/game.types";
import { TournamentCreateData } from "./modules/tournament/tournament.types";

export const generateGameCreateData = (games: GameInsertData[]) => {
    const gameConnectionData: GameCreateConnectionData[] | undefined = (games && games.length > 0) ? games.map(game => {
        const player1Setter = [];
        const player2Setter = [];
        game.player1 && game.player1[0]?.id && player1Setter.push(game.player1[0]);
        game.player1 && game.player1[1]?.id && player1Setter.push(game.player1[1]);
        game.player2 && game.player2[0]?.id && player2Setter.push(game.player2[0]);
        game.player2 && game.player2[1]?.id && player2Setter.push(game.player2[1]);
        const result: GameCreateConnectionData = { index: game.index };
        if (player1Setter.length > 0) {
            result.player1 = { connect: player1Setter }
        }
        if (player2Setter.length > 0) {
            result.player2 = { connect: player2Setter }
        }
        result.hasByePlayer = game.hasByePlayer;
        return result;
    }) : undefined;
    const gameCreateData: TournamentGameCreateData = gameConnectionData ? { create: gameConnectionData } : undefined;
    return gameCreateData;
}

export const generateGameUpdateData = (games: GameInsertData[]) => {
    const gameConnectionData: GameUpdateConnectionData[] | undefined = (games && games.length > 0) ? games.map(game => {
        const player1Setter = [];
        const player2Setter = [];
        game.player1 && game.player1[0]?.id && player1Setter.push(game.player1[0]);
        game.player1 && game.player1[1]?.id && player1Setter.push(game.player1[1]);
        game.player2 && game.player2[0]?.id && player2Setter.push(game.player2[0]);
        game.player2 && game.player2[1]?.id && player2Setter.push(game.player2[1]);
        const result: GameUpdateConnectionData = { index: game.index };
        if (player1Setter.length > 0) {
            result.player1 = { set: player1Setter }
        }
        if (player2Setter.length > 0) {
            result.player2 = { set: player2Setter }
        }
        result.hasByePlayer = game.hasByePlayer;
        return result;
    }) : undefined;
    const gameCreateData: TournamentGameUpdateData = gameConnectionData ? { create: gameConnectionData } : undefined;
    return gameCreateData;
}