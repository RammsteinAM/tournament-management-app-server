import { Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import * as playerService from './player.service';
import { StatusCodesOkay } from '../../types/status';
import { RequestWithUserId, ResBody } from '../../types/main';
import { PlayerCreateData, TournamentCreationData, PlayerData, PlayersCreateData } from "./player.types";

export const getPlayers = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = await playerService.getUserPlayers(req.userId);

    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

export const getPlayer = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = await playerService.getPlayerById(parseInt(`${id}`, 10), req.userId);

    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

export const createPlayer = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    // const data = req.body as PlayerCreateData;
    // //cosnt tournamentTypeId = await tournamentService.getTournamentTypeId()
    // const { id, name, userId } = await playerService.createPlayer(data);
    // const resBody: ResBody<TournamentCreationData> = {
    //     success: true,
    //     // data: { id, name, userId, winningSets, goalsToWin, },
    // };
    // res.status(StatusCodesOkay.Created).json(resBody);
});

export const createPlayers = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const creationData = req.body as string[];
    // cosnt tournamentTypeId = await tournamentService.getTournamentTypeId()
    const newPlayersList = await playerService.createPlayers(creationData, req.userId);
    const resBody: ResBody<PlayerData[]> = {
        success: true,
        data: newPlayersList
    };
    res.status(StatusCodesOkay.Created).json(resBody);
});

export const editPlayer = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
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

export const deletePlayer = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
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
