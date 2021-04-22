import { DBPlayer } from "../player/player.types";

export type TournamentDataWithUserId<T> = T & { userId: number }

export interface GameCreateData {
    userId: number;
    tournamentId: number;

}

export interface GameInsertData {
    index: string;
    player1?: DBPlayer,
    player2?: DBPlayer,
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
}

export interface GameUpdateDataForMultipleGames {
    id: number;
    player1?: DBPlayer,
    player2?: DBPlayer,
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
    player1?: DBPlayer,
    player2?: DBPlayer,
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
    player1?: DBPlayer,
    player2?: DBPlayer,
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
    index?: string;
}

export interface GameCreateConnectionData {
    index: string;
    player1?: { connect: DBPlayer, }
    player2?: { connect: DBPlayer, }
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
}

export interface GameUpdateSetData {
    player1?: { set: DBPlayer, }
    player2?: { set: DBPlayer, }
    scores1?: number[];
    scores2?: number[];
    hasByePlayer?: boolean;
}

export interface GameUpdateSetDataWithId {
    where: { id: number },
    data: GameUpdateSetData
}

export interface TournamentGameCreateData {
    create: GameCreateConnectionData[]
}

export interface TournamentGameUpdateData {
    update: GameUpdateSetDataWithId[]
}