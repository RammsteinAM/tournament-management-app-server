import { GamesData } from "../game/game.types";

export type TournamentDataWithUserId<T> = T & { userId: number }

export interface TournamentCreateData {
    userId: number;
    name: string;
    sets: number;
    tournamentTypeId: number;
    numberOfGoals?: number;
    draw?: boolean;
    thirdPlace?: boolean;
    pointsForWin?: number,
    pointsForDraw?: number;
}

export interface TournamentUpdateData {
    userId: number;
    id: number;
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
    games?: GamesData;
    tournamentTypeId?: number;
}

export interface Player {
    id: number;
    name: string;
}

export type Players = Player[];

export interface Score {
    id: number;
    name: string;
}

export type Scores = Score[];