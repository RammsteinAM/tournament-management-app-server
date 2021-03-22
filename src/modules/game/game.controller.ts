import { Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import * as gameService from './game.service';
import { StatusCodesOkay } from '../../types/status';
import { RequestWithUserId, ResBody } from '../../types/main';
import { GameCreateData, GameCreationData, GameData, GamesCreateData } from "./game.types";

export const getGames = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = await gameService.getTournamentGames(req.userId);

    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

export const getGame = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = await gameService.getGameById(parseInt(`${id}`, 10), req.userId);

    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

export const createGame = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const data = req.body as GameCreateData;
    //cosnt tournamentTypeId = await tournamentService.getTournamentTypeId()
    const { id } = await gameService.createGame(data);
    const resBody: ResBody<GameCreationData> = {
        success: true,
        // data: { id, name, userId, winningSets, goalsToWin, },
    };
    res.status(StatusCodesOkay.Created).json(resBody);
});

export const createGames = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const creationData = req.body as GameCreateData;
    //cosnt tournamentTypeId = await tournamentService.getTournamentTypeId()
    const newPlayersList = await gameService.createGames({...req.body, userId: req.userId}/* req.body, req.userId,  */);
    const resBody: ResBody<GameData[]> = {
        success: true,
        data: newPlayersList
    };
    res.status(StatusCodesOkay.Created).json(resBody);
});

export const editGame = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
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

export const deleteGame = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
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
