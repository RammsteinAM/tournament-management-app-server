import prisma from "../../../prisma/prisma";
import { UserData } from "../auth/auth.types";
import { PlayerData, PlayerInstanceData, PlayersInstanceData } from "./player.types";

export default class Players {
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