import prisma from "../../../prisma/prisma";
import { UserData } from "../auth/auth.types";
import { PlayerData, PlayerInstanceData, PlayersInstanceData } from "./player.types";
export class Player {
    id: number;
    userId: number;
    name: string;
    constructor(data: PlayerInstanceData) {
        this.id = data.id;
        this.userId = data.userId;
        this.name = data.name;
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

export class Players {
    userId: number;
    names: string[];
    constructor(data: PlayersInstanceData) {
        this.userId = data.userId;
        this.names = data.names;
    }

    async getUserPlayers(): Promise<PlayerData[]> {
        return await prisma.player.findMany({ where: { userId: this.userId } });
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
}