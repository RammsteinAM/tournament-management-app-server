import { Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import * as tournamentService from './tournament.service';
import { StatusCodesOkay } from '../../types/status';
import { RequestWithUserId, ResBody } from '../../types/main';
import { TournamentCreateData, TournamentResData, TournamentData, TournamentUpdateData, TournamentDeleteData } from "./tournament.types";
import Tournament from "./tournament.model";

export const getTournaments = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const data = await tournamentService.getUserTournaments(req.userId);
    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

export const getTournament = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = await tournamentService.getTournamentById(parseInt(`${id}`, 10), req.userId);
    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

export const createTournament = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const data = req.body as TournamentCreateData;
    const { id, name, userId, sets, goalsToWin, draw, numberOfGoals, pointsForDraw, pointsForWin, createdAt } = await tournamentService.createTournament({ ...data, userId: req.userId });
    const resBody: ResBody<TournamentResData> = {
        success: true,
        data: { id, name, userId, sets, goalsToWin, draw, numberOfGoals, pointsForDraw, pointsForWin, createdAt },
    };
    res.status(StatusCodesOkay.Created).json(resBody);
});

export const editTournament = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
    const data = req.body as TournamentUpdateData;
    const { id, name, userId, sets, goalsToWin, draw, numberOfGoals, pointsForDraw, pointsForWin, createdAt, updatedAt } = await tournamentService.updateTournament({ ...data, userId: req.userId });
    const resBody: ResBody<TournamentResData> = {
        success: true,
        data: { id, name, userId, sets, goalsToWin, draw, numberOfGoals, pointsForDraw, pointsForWin, createdAt, updatedAt },
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
