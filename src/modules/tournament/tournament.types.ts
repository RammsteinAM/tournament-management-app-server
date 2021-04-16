import { GameInsertData, GamesData, GameUpdateDataForMultipleGames, TournamentGameCreateData, TournamentGameUpdateData } from "../game/game.types";

export type TournamentDataWithUserId<T> = T & { userId: number }

export interface TournamentCreateData {
    tournamentTypeId: number;
    userId: number;
    name: string;
    sets: number;
    numberOfGoals?: number;
    draw?: boolean;
    thirdPlace?: boolean;
    pointsForWin?: number;
    pointsForDraw?: number;
    games?: GameInsertData[];
}

export interface TournamentUpdateData {
    id: number;
    userId: number;
    name?: string;
    sets?: number;
    numberOfGoals?: number;
    draw?: boolean;
    thirdPlace?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
}

export interface TournamentDeleteData {
    userId: number;
    id: number;
}

export interface TournamentResData {
    id: number;
    userId: number;
    name: string;
    sets?: number;
    goalsToWin?: number;
    numberOfGoals?: number;
    draw?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    createdAt?: Date;
    updatedAt?: Date;
    games: GamesData;
}

export interface TournamentData {
    id: number;
    userId: number;
    name?: string;
    sets?: number;
    goalsToWin?: number;
    numberOfGoals?: number;
    draw?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    games?: GamesData;
    createdAt: Date;
    updatedAt: Date;
}

// export interface TournamentCreateGamesData {
//     id: number;
//     games?: GamesData;
// }

export type TournamentsNormalizedData = { [id: number]: TournamentData };

export interface TournamentInstanceData {
    id?: number;
    userId: number;
    name?: string;
    sets?: number;
    numberOfGoals?: number;
    draw?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    players?: Players;
    newGames?: TournamentGameCreateData;
    existingGames?: TournamentGameUpdateData;
    tournamentTypeId?: number;
}

export interface Player {
    id: number;
    name: string;
}

export type Players = Player[];

export interface GamesCreateData {
    userId: number;
    tournamentId: number;
    games: GameInsertData[];
}

export interface GamesUpdateData {
    userId: number;
    tournamentId: number;
    games: GameUpdateDataForMultipleGames[];
}
