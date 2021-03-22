import prisma from "../../../prisma/prisma";
import { UserData } from "../auth/auth.types";
import { PlayerData, PlayerInstanceData } from "./player.types";
export default class Player {
    id: number;
    userId: number;
    name: string;
    names: string[];
    // players: Players;
    // games: Games;
    constructor(data: PlayerInstanceData) {
        this.id = data.id;
        this.userId = data.userId;
        this.name = data.name;
        this.names = data.names;
        // this.games = data.games;
    }

    async getByName(): Promise<PlayerData> {
        return await prisma.player.findFirst({ where: { name: this.name } });
    }

    async getById(): Promise<PlayerData> {
        return await prisma.player.findUnique({ where: { id: this.id } });
    }

    async getUserPlayers(): Promise<PlayerData[]> {
        return await prisma.player.findMany({ where: { userId: this.userId } });
    }

    async create(): Promise<PlayerData> {
        return await prisma.player.create({
            data:
            {
                name: this.name,
                user: {
                    connect: { id: 1 }
                }
            }
        });
    }

    // async createMany(): Promise<any> {
    //     return await prisma.player.createMany({
    //         data: this.players
    //     });
    // }

    async createMany(): Promise<UserData> {
        return await prisma.user.update({
            where: { id: this.userId },
            data: {
                players: {
                    create: this.names.map(name => ({name}))
                }
            },
            include: {
                players: {
                }
            }
        });
    }

    async updateById(): Promise<PlayerData> {
        return await prisma.player.update({
            where: {
                id: this.id
            },
            data:
            {
                name: this.name,
            }
        });
    }


    async deleteById(): Promise<PlayerData> {
        return await prisma.player.delete({
            where: {
                id: this.id
            }
        })
    }

}