import prisma from "../../../prisma/prisma";
import { GamesData } from "../game/game.types";
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
    games: GamesData;
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
        return await prisma.tournament.findUnique({ where: { id: this.id } });
    }

    async getAll(): Promise<TournamentData[]> {
        return await prisma.tournament.findMany({ where: { userId: this.userId } });
    }

    async create(): Promise<TournamentData> {
        return await prisma.tournament.create({
            data:
            {
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