import { GameData, GameInsertData, GamesData, GameUpdateDataForMultipleGames, TournamentGameCreateData, TournamentGameUpdateData } from "../game/game.types";
import { DBPlayer } from "../player/player.types";

export type TournamentDataWithUserId<T> = T & { userId: number }

export interface TournamentCreateData {
    tournamentTypeId: number;
    userId: number;
    name: string;
    sets: number;
    numberOfTables?: number;
    numberOfGoals?: number;
    numberOfLives?: number;
    draw?: boolean;
    thirdPlace?: boolean;
    pointsForWin?: number;
    pointsForDraw?: number;
    games?: GameInsertData[];
    players?: number[];
}

export interface TournamentUpdateData {
    id: number;
    userId: number;
    name?: string;
    sets?: number;
    numberOfGoals?: number;
    numberOfLives?: number;
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
    numberOfTables?: number;
    numberOfLives?: number;
    numberOfGoals?: number;
    draw?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    createdAt?: Date;
    updatedAt?: Date;
    games: GamesData;
    players?: number[];
}


export interface TournamentExportResData {
    name: string;
    sets: number;
    numberOfLives?: number;
    numberOfGoals?: number;
    numberOfTables?: number;
    draw?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    createdAt: Date;
    tournamentTypeId?: number;
    games?: Omit<GameData, 'id' | 'tournamentId'>[];
    players?: { id: number, name: string }[];
}

export interface TournamentData {
    id: number;
    userId: number;
    name?: string;
    sets?: number;
    numberOfTables?: number;
    numberOfLives?: number;
    numberOfGoals?: number;
    draw?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    games?: GamesData;
    players?: DBPlayer;
    createdAt: Date;
    updatedAt: Date;
}

export interface TournamentExportData {
    name?: string;
    sets?: number;
    numberOfTables?: number;
    numberOfLives?: number;
    numberOfGoals?: number;
    draw?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    games?: Omit<GameData, 'id' | 'tournamentId'>[];
    players?: { id: number, name: string }[];
    createdAt: Date;
}

export interface TournamentGamesData {
    id: number;
    games?: GamesData;
}

export type TournamentsNormalizedData = { [id: number]: TournamentData };

export interface TournamentInstanceData {
    id?: number;
    userId: number;
    name?: string;
    sets?: number;
    numberOfTables?: number;
    numberOfGoals?: number;
    numberOfLives?: number;
    draw?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    players?: TournamentPlayerConnectData;
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

export interface TournamentPlayerConnectData {
    connect: DBPlayer
}

export type LMSPlayer = { id: number | [number, number] }
export type LMSPlayers = LMSPlayer[]