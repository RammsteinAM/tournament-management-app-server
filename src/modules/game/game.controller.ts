import { Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import * as gameService from './game.service';
import { StatusCodesOkay } from '../../types/status';
import { RequestWithUserId, ResBody } from '../../types/main';
import { GameCreateData, GameCreationData, GameData, GamesData, GamesResData, GameUpdateData } from "./game.types";
import { TournamentResData } from "../tournament/tournament.types";

export const getGames = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const tournamentId = req.query.tournamentId?.toString();
    const data = await gameService.getTournamentGames(req.userId, parseInt(tournamentId, 10));
    const resBody: ResBody<GamesResData> = {
        success: true,
        data: { [tournamentId]: data },
    };
    res.status(StatusCodesOkay.OK).json(resBody);
})

export const getGame = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = await gameService.getGameById(parseInt(`${id}`, 10), req.userId);

    res.status(StatusCodesOkay.OK).json({
        success: true,
        data,
    });
})

// export const createGame = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
//     const data = req.body as GameCreateData;
//     //cosnt tournamentTypeId = await tournamentService.getTournamentTypeId()
//     const { id } = await gameService.createGame(data);
//     const resBody: ResBody<GameCreationData> = {
//         success: true,
//         // data: { id, name, userId, winningSets, goalsToWin, },
//     };
//     res.status(StatusCodesOkay.Created).json(resBody);
// });

export const editGame = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const gameUpdateData = req.body as GameUpdateData;
    const { id: gameId } = req.params;
    const data = await gameService.updateGame(gameUpdateData, parseInt(gameId, 10));
    const resBody: ResBody<GameData> = {
        success: true,
        data,
    };
    res.status(StatusCodesOkay.OK).json(resBody);
})

export const editGameAndNextGames = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
    const gameUpdateData = req.body as GameUpdateData;
    const { id: gameId } = req.params;

    const data = await gameService.updateGameAndNextGames(gameUpdateData, parseInt(gameId, 10), req.userId);
    const resData = { tournamentId: data.id, games: data.games }
    const resBody: ResBody<any> = {
        success: true,
        data: resData,
    };
    res.status(StatusCodesOkay.OK).json(resBody);
})

export const deleteGame = asyncWrapper(async (req: RequestWithUserId<{ id: number }>, res: Response): Promise<void> => {

})
