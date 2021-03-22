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

export interface TournamentCreationData {
    id: number;
    userId: number;
    name: string;
    sets: number;
    goalsToWin?: number;
    numberOfGoals?: number;
    draw?: boolean;  
    pointsForWin?: number,
    pointsForDraw?: number;
    createdAt: Date;
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

export type Tournaments = TournamentData[];

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

// export interface Game {
//     id: number;
//     tournamentId: number;
//     scores: Scores;
//     round: number;
// }

// export type Games = Game[];

export interface Score {
    id: number;
    name: string;
}

export type Scores = Score[];