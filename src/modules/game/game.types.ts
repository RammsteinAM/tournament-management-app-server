
export type TournamentDataWithUserId<T> = T & { userId: number }

export interface GameCreateData {
    userId: number;
    tournamentId: number;
}

export interface GamesCreateData {
    userId: number;
    tournamentId: number;
}

export interface GameCreationData {
    id: number;
    userId?: number;
    name: string;
    winningSets: number;
    goalsToWin: number;
    playerIds: number[];
    gameIds: number[];
}

export interface GameData {
    id: number;
    // userId: number;
    index: string;
}

export type GamesData = GameData[];

export interface GameInstanceData {
    id?: number;
    userId: number;
    tournamentId?: number;
    player1Ids?: [number, number?];
    player2Ids?: [number, number?];
    scores1?: number[];
    scores2?: number[];
    indexes?: string[];
    sets?: number;
    goalsToWin?: number;
    draw?: boolean;
    thirdPlace?: boolean;    
    pointsForWin?: number,
    pointsForDraw?: number;
    tournamentTypeId?: number;
}