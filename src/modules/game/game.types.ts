
export type TournamentDataWithUserId<T> = T & { userId: number }

export interface GameCreateData {
    userId: number;
    tournamentId: number;

}

export interface GameInsertData {
    index: string;
    player1?: { id: number }[],
    player2?: { id: number }[],
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
}

export interface GameUpdateDataForMultipleGames {
    id: number;
    player1?: { id: number }[],
    player2?: { id: number }[],
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
}

export interface GameCreationData {
    id: number;
    userId?: number;
    playerIds: number[];
}

export interface GameData {
    id: number;
    index: string;
    player1?: { id: number }[],
    player2?: { id: number }[],
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
    tournamentId?: number;
}

export type GamesData = GameData[];

export type NormalizedGamesData = { [index: string]: GameData };

export type GamesResData = { [tournamentId: number]: GamesData }

export type GameUpdateData = Omit<GameData, 'index'>

export interface GameInstanceData {
    id?: number;
    userId?: number;
    tournamentId?: number;
    player1?: { id: number }[],
    player2?: { id: number }[],
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
    index?: string;
}

export interface GameCreateConnectionData {
    index: string;
    player1?: { connect: { id: number }[], }
    player2?: { connect: { id: number }[], }
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
}

export interface GameUpdateSetData {
    player1?: { set: { id: number }[], }
    player2?: { set: { id: number }[], }
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
}

export interface GameUpdateSetDataWithId {
    where: {id: number},
    data: GameUpdateSetData
}

export interface TournamentGameCreateData {
    create: GameCreateConnectionData[]
}

export interface TournamentGameUpdateData {
    update: GameUpdateSetDataWithId[]
}