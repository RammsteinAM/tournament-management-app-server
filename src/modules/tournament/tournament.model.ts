import prisma from "../../../prisma/prisma";
import { GamesResData, TournamentGameCreateData, TournamentGameUpdateData } from "../game/game.types";
import { DBPlayer } from "../player/player.types";
import { TournamentData, TournamentExportData, TournamentExportResData, TournamentGamesData, TournamentInstanceData, TournamentPlayerConnectData, TournamentResData } from "./tournament.types";
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
    isFinished: boolean;
    newGames: TournamentGameCreateData;
    existingGames: TournamentGameUpdateData;
    tournamentTypeId: number;
    players: TournamentPlayerConnectData;
    constructor(data: TournamentInstanceData) {
        this.id = data.id;
        this.userId = data.userId;
        this.name = data.name;
        this.sets = data.sets;
        this.numberOfGoals = data.numberOfGoals;
        this.numberOfLives = data.numberOfLives;
        this.pointsForWin = data.pointsForWin;
        this.pointsForDraw = data.pointsForDraw;
        this.draw = data.draw;
        this.newGames = data.newGames;
        this.existingGames = data.existingGames;
        this.tournamentTypeId = data.tournamentTypeId;
        this.players = data.players;
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
                userId: true,
                draw: true,
                tournamentTypeId: true,
                createdAt: true,
                updatedAt: true,
                players: {
                    select: {
                        id: true
                    }
                },
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

    async getExportDataById(): Promise<TournamentExportData> {
        return await prisma.tournament.findUnique({
            where: { id: this.id },
            select: {
                name: true,
                sets: true,
                numberOfGoals: true,
                numberOfLives: true,
                numberOfTables: true,
                pointsForDraw: true,
                pointsForWin: true,
                draw: true,
                tournamentTypeId: true,
                createdAt: true,
                players: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                games: {
                    select: {
                        index: true,
                        player1: { select: { id: true, name: true } },
                        player2: { select: { id: true, name: true } },
                        scores1: true,
                        scores2: true,
                        hasByePlayer: true,
                    }
                }
            }

        });
    }

    async getByIdForPlayers(): Promise<TournamentData> {
        return await prisma.tournament.findUnique({
            where: { id: this.id },
            select: {
                id: true,
                name: true,
                numberOfLives: true,
                sets: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
                players: {
                    select: {
                        id: true
                    }
                },
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
                games: this.newGames,
                players: this.players,
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
                players: {
                    select: {
                        id: true
                    }
                },
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

    async createGames(): Promise<TournamentGamesData> {
        return await prisma.tournament.update({
            where: { id: this.id },
            data: {
                games: this.newGames,
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

    async updateGames(): Promise<TournamentResData> {
        return await prisma.tournament.update({
            where: { id: this.id },
            data: {
                games: this.existingGames,
            },
            select: {
                id: true,
                name: true,
                userId: true,
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