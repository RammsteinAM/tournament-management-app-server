import prisma from "../../../prisma/prisma";
import { GamesData, GamesResData, TournamentGameCreateData } from "../game/game.types";
import { TournamentData, TournamentInstanceData, Players } from "./tournament.types";
export default class Tournament {
    id: number;
    userId: number;
    name: string;
    sets: number;
    numberOfGoals: number;
    numberOfLives: number;
    pointsForWin: number;
    pointsForDraw: number;
    draw: boolean;
    // players: Players;
    games: TournamentGameCreateData;
    tournamentTypeId: number;
    constructor(data: TournamentInstanceData) {
        this.id = data.id;
        this.userId = data.userId;
        this.name = data.name;
        this.sets = data.sets;
        this.numberOfGoals = data.numberOfGoals;
        this.draw = data.draw;
        // this.players = data.players;
        this.games = data.games;
        this.tournamentTypeId = data.tournamentTypeId;
    }

    async getById(): Promise<TournamentData> {
        return await prisma.tournament.findUnique({
            where: { id: this.id },
            select: {
                id: true,
                name: true,
                numberOfGoals: true,
                numberOfLives: true,
                numberOfTables: true,
                pointsForDraw: true,
                pointsForWin: true,
                sets: true,
                tournamentType: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                draw: true,
                tournamentTypeId: true,
                games: {
                    select: {
                        id: true,
                        index: true,
                        player1: { select: { id: true } },
                        player2: { select: { id: true } },
                        scores1: true,
                        scores2: true,
                        hasByePlayer: true,
                    }
                }
            }

        });
    }

    async getAll(): Promise<TournamentData[]> {
        return await prisma.tournament.findMany({ where: { userId: this.userId } });
    }

    async create(): Promise<TournamentData> {
        return await prisma.tournament.create({
            data: {
                name: this.name,
                sets: this.sets,
                draw: this.draw,
                numberOfGoals: this.numberOfGoals,
                numberOfLives: this.numberOfLives,
                pointsForWin: this.pointsForWin,
                pointsForDraw: this.pointsForDraw,
                user: {
                    connect: { id: this.userId }
                },
                tournamentType: {
                    connect: { id: this.tournamentTypeId }
                },
                games: this.games,
            },
            select: {
                id: true,
                name: true,
                numberOfGoals: true,
                numberOfLives: true,
                numberOfTables: true,
                pointsForDraw: true,
                pointsForWin: true,
                sets: true,
                tournamentType: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                draw: true,
                tournamentTypeId: true,
                games: {
                    select: {
                        id: true,
                        index: true,
                        player1: { select: { id: true } },
                        player2: { select: { id: true } },
                        scores1: true,
                        scores2: true,
                        hasByePlayer: true,
                    }
                }
            }
        });
    }

    async createGames(): Promise<GamesResData> {
        return await prisma.tournament.update({
            where: { id: this.id },
            data: {
                games: this.games,
            },
            select: {
                id: true,
                games: {
                    select: {
                        id: true,
                        index: true,
                        player1: { select: { id: true } },
                        player2: { select: { id: true } },
                        scores1: true,
                        scores2: true,
                        hasByePlayer: true,
                    }
                }
            }
        });
    }

    async updateById(): Promise<TournamentData> {
        return await prisma.tournament.update({
            where: { id: this.id },
            data: {
                name: this.name,
                sets: this.sets,
                numberOfGoals: this.numberOfGoals,
                draw: this.draw,
                numberOfLives: this.numberOfLives,
                pointsForWin: this.pointsForWin,
                pointsForDraw: this.pointsForDraw,
            }
        });
    }

    async deleteById(): Promise<{ id: number }> {
        await prisma.game.deleteMany({
            where: {
                tournamentId: this.id
            }
        })
        return await prisma.tournament.delete({
            where: {
                id: this.id
            },
            select: {
                id: true
            }
        })
    }

}