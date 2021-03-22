import { Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import * as tournamentService from './tournament.service';
import { StatusCodesOkay } from '../../types/status';
import { RequestWithUserId, ResBody } from '../../types/main';
import { TournamentCreateData, TournamentCreationData, TournamentData } from "./tournament.types";

export const getTournaments = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {

    // const user = new User({ id: 70 })
    // const userData = await user.getUserById();
    // const { id } = req.params;
    const data = await tournamentService.getUserTournaments(req.userId);
    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

export const getTournament = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {

    // const user = new User({ id: 70 })
    // const userData = await user.getUserById();
    const { id } = req.params;
    const data = await tournamentService.getTournamentById(parseInt(`${id}`, 10), req.userId);
    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

export const createTournament = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const data = req.body as TournamentCreateData;
    const { id, name, userId, sets, goalsToWin, draw, numberOfGoals, pointsForDraw, pointsForWin, createdAt } = await tournamentService.createTournament(data);
    const resBody: ResBody<TournamentCreationData> = {
        success: true,
        data: { id, name, userId, sets, goalsToWin, draw, numberOfGoals, pointsForDraw, pointsForWin, createdAt },
    };
    res.status(StatusCodesOkay.Created).json(resBody);
});

export const editTournament = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
    // const { id } = req.params;
    // const data = req.body as UserEditRequestData;
    // if (!data.displayName && !data.currentPassword) throw new BadRequestError();
    // if (data.currentPassword) {
    //     validateUserUpdate(data);
    // }
    // const { email, displayName } = await userService.updateUser(parseInt(`${id}`, 10), data);

    // res.status(StatusCodesOkay.OK).json({
    //     success: true,
    //     data: { id, email, displayName },
    // });
})
