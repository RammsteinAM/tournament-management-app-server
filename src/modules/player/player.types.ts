
export type TournamentDataWithUserId<T> = T & { userId: number }

export interface PlayerCreateData {
    userId: number;
    name?: string;
}

export interface PlayersCreateData {
    userId: number;
    names?: string[];
}

export interface TournamentCreationData {
    id: number;
    userId?: number;
    name: string;
    winningSets: number;
    goalsToWin: number;
    playerIds: number[];
    gameIds: number[];
}

export interface PlayerData {
    id: number;
    userId: number;
    name?: string;
    weight?: number;
}

export type Players = PlayerData[];

export interface PlayerInstanceData {
    id?: number;
    userId: number;
    name?: string;
    names?: string[];
    sets?: number;
    goalsToWin?: number;
    draw?: boolean;
    thirdPlace?: boolean;    
    pointsForWin?: number,
    pointsForDraw?: number;
    //games?: Games;
    tournamentTypeId?: number;
}

export interface Player {
    id: number;
    name: string;
}

// export interface Game {
//     id: number;
//     tournamentId: number;
//     scores: Scores;
//     round: number;
// }

// export type Games = Game[];