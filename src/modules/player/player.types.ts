
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
}

export interface PlayersInstanceData {
    userId: number;
    names?: string[];
}

export interface PlayerModificationInstanceData {
    tournamentId: number;
    id?: number;
    playerId?: number;
    initialNumberOfLives?: number;
    removed?: boolean;
}

export interface PlayerModificationData {
    id: number;
    tournamentId: number;
    playerId: number;
    initialNumberOfLives?: number;
    removed?: boolean;
}

export interface PlayerModificationCreateData {
    tournamentId: number;
    playerId: number;
    initialNumberOfLives?: number;
    removed?: boolean;
}

export type DBPlayer = { id: number }[]
export type DBPlayerWithName = { id: number, name: string }[]