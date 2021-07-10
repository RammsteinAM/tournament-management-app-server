import prisma from "../../../prisma/prisma";
import { PlayerModificationData, PlayerModificationInstanceData } from "./player.types";

export default class PlayerModification {
    id: number;
    tournamentId: number;
    playerId?: number;
    initialNumberOfLives?: number;
    removed?: boolean;
    constructor(data: PlayerModificationInstanceData) {
        this.id = data.id;
        this.tournamentId = data.tournamentId;
        this.playerId = data.playerId;
        this.initialNumberOfLives = data.initialNumberOfLives;
        this.removed = data.removed;
    }

    async getPlayerModifications(): Promise<PlayerModificationData[]> {
        return await prisma.playerModification.findMany({
            where: { tournamentId: this.tournamentId }, select: {
                id: true,
                tournamentId: true,
                playerId: true,
                initialNumberOfLives: true,
                removed: true
            }
        });
    }

    async findPlayerModification(): Promise<{ id: number }> {
        return await prisma.playerModification.findFirst({
            where: { tournamentId: this.tournamentId, playerId: this.playerId }, select: {
                id: true
            }
        });
    }

    async createPlayerModification(): Promise<PlayerModificationData> {
        return await prisma.playerModification.create({
            data: {
                tournament: {
                    connect: {
                        id: this.tournamentId
                    }
                },
                player: {
                    connect: {
                        id: this.playerId
                    }
                },
                initialNumberOfLives: this.initialNumberOfLives,
                removed: this.removed
            },
            select: {
                id: true,
                tournamentId: true,
                playerId: true,
                initialNumberOfLives: true,
                removed: true
            }
        });
    }

    async updatePlayerModification(id: number): Promise<PlayerModificationData> {
        return await prisma.playerModification.update({
            where: { id },
            data: {
                initialNumberOfLives: this.initialNumberOfLives,
                removed: this.removed
            },
            select: {
                id: true,
                tournamentId: true,
                playerId: true
            }
        });
    }
}