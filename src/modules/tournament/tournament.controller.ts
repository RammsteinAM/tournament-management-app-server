import { Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import * as tournamentService from './tournament.service';
import { StatusCodesOkay } from '../../types/status';
import { RequestWithUserId, ResBody } from '../../types/main';
import { TournamentCreateData, TournamentExportResData, TournamentGamesData, TournamentResData, TournamentUpdateData } from "./tournament.types";
import { GamesCreateData } from "../tournament/tournament.types";
import { GamesResData } from "../game/game.types";

export const getTournaments = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const data = await tournamentService.getUserTournaments(req.userId);
    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

export const getTournament = asyncWrapper(async (req: RequestWithUserId<{ id: string }>, res: Response): Promise<void> => {
    const { id: idFromParam } = req.params;
    const { id, name, userId, sets, draw, numberOfTables, numberOfLives, numberOfGoals, pointsForDraw, pointsForWin, createdAt, updatedAt, games, players } = await tournamentService.getTournamentById(parseInt(idFromParam, 10), req.userId);
    const playerIds = players.map(val => val.id);
    const resBody: ResBody<TournamentResData> = {
        success: true,
        data: { id, name, userId, sets, draw, numberOfTables, numberOfLives, numberOfGoals, pointsForDraw, pointsForWin, createdAt, updatedAt, games, players: playerIds },
    };
    res.status(StatusCodesOkay.OK).json(resBody);
})

export const getTournamentExportData = asyncWrapper(async (req: RequestWithUserId<{ id: string }>, res: Response): Promise<void> => {
    const { id: idFromParam } = req.params;
    const { name, sets, draw, numberOfLives, numberOfTables, numberOfGoals, pointsForDraw, pointsForWin, createdAt, games, players } = await tournamentService.getTournamentExportDataById(parseInt(idFromParam, 10), req.userId);
    console.log(players)
    const resBody: ResBody<TournamentExportResData> = {
        success: true,
        data: { name, sets, draw, numberOfLives, numberOfTables, numberOfGoals, pointsForDraw, pointsForWin, createdAt, games, players },
    };
    res.status(StatusCodesOkay.OK).json(resBody);
})

export const createTournament = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const data = req.body as TournamentCreateData;
    const { id, name, userId, sets, draw, numberOfTables, numberOfLives, numberOfGoals, pointsForDraw, pointsForWin, createdAt, updatedAt, games, players } = await tournamentService.createTournament({ ...data, userId: req.userId });
    const playerIds = players.map(val => val.id);
    const resBody: ResBody<TournamentResData> = {
        success: true,
        data: { id, name, userId, sets, draw, numberOfTables, numberOfLives, numberOfGoals, pointsForDraw, pointsForWin, createdAt, updatedAt, games, players: playerIds },
    };
    res.status(StatusCodesOkay.Created).json(resBody);
});

export const editTournament = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
    const data = req.body as TournamentUpdateData;
    const { id, name, userId, sets, draw, numberOfTables, numberOfLives, numberOfGoals, pointsForDraw, pointsForWin, createdAt, updatedAt, games } = await tournamentService.updateTournament({ ...data, userId: req.userId });
    const resBody: ResBody<TournamentResData> = {
        success: true,
        data: { id, name, userId, sets, draw, numberOfTables, numberOfLives, numberOfGoals, pointsForDraw, pointsForWin, createdAt, updatedAt, games },
    };
    res.status(StatusCodesOkay.OK).json(resBody);
})

export const deleteTournament = asyncWrapper(async (req: RequestWithUserId<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { id: deletedId } = await tournamentService.deleteTournament({ id: parseInt(id, 10), userId: req.userId });
    const resBody: ResBody<{ id: number }> = {
        success: true,
        data: { id: deletedId },
    };
    res.status(StatusCodesOkay.OK).json(resBody);
})

export const createGames = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const data = req.body as GamesCreateData;
    const gamesData = await tournamentService.createTournamentGames(data);
    const resBody: ResBody<TournamentGamesData> = {
        success: true,
        data: gamesData
    };
    res.status(StatusCodesOkay.Created).json(resBody);
});

export const createNewLMSRound = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const { tournamentId } = req.body as { tournamentId: number };
    const data = await tournamentService.createNextLMSRound(tournamentId, req.userId);
    const resBody: ResBody<GamesResData> = {
        success: true,
        data: { [tournamentId]: data.games },
    };
    res.status(StatusCodesOkay.Created).json(resBody);
});