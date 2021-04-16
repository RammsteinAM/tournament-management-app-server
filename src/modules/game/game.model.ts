import prisma from "../../../prisma/prisma";
import { UserData } from "../auth/auth.types";
import { TournamentData } from "../tournament/tournament.types";
import { GameData, GameInstanceData, GamesData } from "./game.types";
export default class Game {
    id: number;
    userId: number;
    tournamentId: number;
    index: string;
    player1: { id: number }[];
    player2: { id: number }[];
    scores1: number[];
    scores2: number[];
    hasByePlayer?: boolean;
    constructor(data: GameInstanceData) {
        this.id = data.id;
        this.userId = data.userId;
        this.tournamentId = data.tournamentId;
        this.player1 = data.player1;
        this.player2 = data.player2;
        this.scores1 = data.scores1;
        this.scores2 = data.scores2;
        this.index = data.index;
        this.hasByePlayer = data.hasByePlayer;
    }

    async getById(): Promise<GameData> {
        const a = await prisma.game.findUnique({
            where: { id: this.id },
            select: {
                id: true,
                index: true,
                tournamentId: true,
                player1: {
                    select: { id: true }
                },
                player2: {
                    select: { id: true }
                },
                scores1: true,
                scores2: true,
                hasByePlayer: true,
            }
        });
        return a;
    }

    async getTournamentGames(): Promise<GamesData> {
        return await prisma.game.findMany({
            where: { tournamentId: this.tournamentId },
            select: {
                id: true,
                index: true,
                player1: {
                    select: { id: true }
                },
                player2: {
                    select: { id: true }
                },
                scores1: true,
                scores2: true,
                hasByePlayer: true,
            }
        });
    }

    async create(): Promise<GameData> {
        return await prisma.game.create({
            data:
            {
                index: this.index,
                tournament: {
                    connect: { id: this.tournamentId }
                }
            }
        });
    }

    // async createMany(): Promise<TournamentData> {
    //     return await prisma.tournament.update({
    //         where: { id: this.tournamentId },
    //         data: {
    //             games: {
    //                 create: this.indexes.map(index => ({ index }))
    //             },
    //         },
    //         include: {
    //             games: {
    //             }
    //         }
    //     });
    // }

    async updateById(): Promise<GameData> {
        let player1: [{ id: number }, { id: number }?] | undefined;
        let player2: [{ id: number }, { id: number }?] | undefined;
        if (this.player1 && this.player1[0].id) {
            player1 = [{ id: this.player1[0].id }];
            if (this.player1[1]?.id) {
                player1.push({ id: this.player1[1].id });
            }
        }
        if (this.player2 && this.player2[0].id) {
            player2 = [{ id: this.player2[0].id }];
            if (this.player2[1]?.id) {
                player2.push({ id: this.player2[1].id });
            }
        }
        return prisma.game.update({
            where: {
                id: this.id
            },
            data:
            {
                player1: (player1 && player1[0]?.id) ? { set: player1 } : undefined,
                player2: (player2 && player2[0]?.id) ? { set: player2 } : undefined,
                scores1: this.scores1,
                scores2: this.scores2,
                hasByePlayer: this.hasByePlayer,
            },
            select: {
                id: true,
                index: true,
                tournamentId: true,
                player1: { select: { id: true } },
                player2: { select: { id: true } },
                scores1: true,
                scores2: true,
                hasByePlayer: true,
            }
        });
    }

    async deleteById(): Promise<GameData> {
        return await prisma.game.delete({
            where: {
                id: this.id
            }
        })
    }

}