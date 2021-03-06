import { GameInsertData, GamesData, GameUpdateDataForMultipleGames, GameViewData, ImportedGamesData, TournamentGameCreateData, TournamentGameUpdateData } from "../game/game.types";
import { DBPlayer, DBPlayerWithName, PlayerModificationData } from "../player/player.types";

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
    shareId?: string;
}

export interface TournamentBaseData {
    userId: number;
    id: number;
}

export interface TournamentResData {
    id: number;
    userId: number;
    name: string;
    sets?: number;
    numberOfTables?: number;
    tablesByGameIndex?: {};
    numberOfLives?: number;
    numberOfGoals?: number;
    draw?: boolean;
    monsterDYP?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    tournamentTypeId?: number;
    playerModification: PlayerModificationData[];
    shareId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    games: GamesData;
    players?: number[];
}

export interface TournamentJSONData {
    name: string;
    sets: number;
    numberOfLives?: number;
    numberOfGoals?: number;
    numberOfTables?: number;
    tablesByGameIndex?: {};
    draw?: boolean;
    monsterDYP?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    tournamentTypeId: number;
    playerModification?: { player: { name: string }, initialNumberOfLives?: number, removed?: boolean }[];
    games: ImportedGamesData;
    players?: { id: number, name: string }[];
}

export interface TournamentData {
    id: number;
    userId: number;
    name?: string;
    sets?: number;
    numberOfTables?: number;
    tablesByGameIndex?: {};
    numberOfLives?: number;
    numberOfGoals?: number;
    draw?: boolean;
    monsterDYP?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    tournamentTypeId?: number;
    playerModification?: PlayerModificationData[];
    games?: GamesData;
    players?: DBPlayer;
    shareId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TournamentViewData {
    name?: string;
    sets?: number;
    numberOfTables?: number;
    tablesByGameIndex?: {};
    numberOfLives?: number;
    numberOfGoals?: number;
    draw?: boolean;
    monsterDYP?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    tournamentTypeId?: number;
    playerModification?: PlayerModificationData[];
    games?: GameViewData;
    players?: DBPlayerWithName;
    createdAt: Date;
    updatedAt: Date;
}

export interface TournamentGamesData {
    id: number;
    shareId?: string;
    games?: GamesData;
}

export type TournamentsNormalizedData = { [id: number]: TournamentData };

export interface TournamentInstanceData {
    id?: number;
    userId: number;
    name?: string;
    sets?: number;
    numberOfTables?: number;
    tablesByGameIndex?: {};
    numberOfGoals?: number;
    numberOfLives?: number;
    draw?: boolean;
    monsterDYP?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
    players?: TournamentPlayerConnectData;
    newGames?: TournamentGameCreateData;
    existingGames?: TournamentGameUpdateData;
    tournamentTypeId?: number;
    shareId?: string;
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