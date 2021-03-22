import prisma from "../../../prisma/prisma";
import { UserData } from "../auth/auth.types";
import { TournamentData } from "../tournament/tournament.types";
import { GameData, GameInstanceData } from "./game.types";
export default class Game {
    id: number;
    userId: number;
    tournamentId: number;
    index: string;
    indexes: string[];
    player1Ids: [number, number?];
    player2Ids: [number, number?];
    scores1: number[];
    scores2: number[];
    // players: Players;
    constructor(data: GameInstanceData) {
        this.id = data.id;
        this.userId = data.userId;
        this.tournamentId = data.tournamentId;
        this.player1Ids = data.player1Ids;
        this.player2Ids = data.player2Ids;
        this.scores1 = data.scores1;
        this.scores2 = data.scores2;
        this.indexes = data.indexes;
    }

    async getById(): Promise<GameData> {
        return await prisma.game.findUnique({ where: { id: this.id } });
    }

    async getTournamentGames(): Promise<GameData[]> {
        return await prisma.game.findMany({ where: { tournamentId: this.tournamentId } });
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

    // async createMany(): Promise<any> {
    //     return await prisma.player.createMany({
    //         data: this.players
    //     });
    // }

    async createMany(): Promise<TournamentData> {
        return await prisma.tournament.update({
            where: { id: this.tournamentId },
            data: {
                games: {
                    create: this.indexes.map(index => ({ index }))
                },
            },
            include: {
                games: {
                }
            }
        });
    }

    async updateById(): Promise<GameData> {
        let player1: [{id: number}, {id: number}?] | undefined;
        let player2: [{id: number}, {id: number}?] | undefined;
        if (this.player1Ids && this.player1Ids[0]) {
            player1 = [{id: this.player1Ids[0]}];
            if (this.player1Ids[1]) {
                player1.push({id: this.player1Ids[1]});
            }
        }
        if (this.player2Ids && this.player2Ids[0]) {
            player2 = [{id: this.player2Ids[0]}];
            if (this.player2Ids[1]) {
                player2.push({id: this.player2Ids[1]});
            }
        }
        return await prisma.game.update({
            where: {
                id: this.id
            },
            data:
            {
                // player1: { connect: this.player1Ids[0] ? [{ id: this.player1Ids[0] }, { id: this.player1Ids[1] }] : undefined },
                // player2: { connect: this.player2Ids[0] ? [{ id: this.player2Ids[0] }, { id: this.player2Ids[1] }] : undefined },
                player1: { connect: player1 },
                player2: { connect: player2 },
                scores1: this.scores1,
                scores2: this.scores2,
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