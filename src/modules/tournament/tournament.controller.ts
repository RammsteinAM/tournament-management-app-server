import { Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import * as tournamentService from "./tournament.service";
import { StatusCodesOkay } from "../../types/status";
import { RequestWithUserId, ResBody } from "../../types/main";
import {
    TournamentCreateData,
    TournamentJSONData,
    TournamentGamesData,
    TournamentResData,
    TournamentUpdateData,
} from "./tournament.types";
import { GamesCreateData } from "../tournament/tournament.types";
import { GamesResData } from "../game/game.types";

export const getTournaments = asyncWrapper(
    async (req: RequestWithUserId, res: Response): Promise<void> => {
        const data = await tournamentService.getUserTournaments(req.userId);
        res.status(StatusCodesOkay.OK).json({
            success: true,
            data,
        });
    }
);

export const getTournament = asyncWrapper(
    async (
        req: RequestWithUserId<{ id: string }>,
        res: Response
    ): Promise<void> => {
        const { id: idFromParam } = req.params;
        const {
            id,
            name,
            userId,
            sets,
            draw,
            monsterDYP,
            tournamentTypeId,
            shareId,
            numberOfTables,
            tablesByGameIndex,
            numberOfLives,
            numberOfGoals,
            pointsForDraw,
            pointsForWin,
            playerModification,
            createdAt,
            updatedAt,
            games,
            players,
        } = await tournamentService.getTournamentById(
            parseInt(idFromParam, 10),
            req.userId
        );
        const playerIds = players.map((val) => val.id);
        const resBody: ResBody<TournamentResData> = {
            success: true,
            data: {
                id,
                name,
                userId,
                sets,
                draw,
                monsterDYP,
                tournamentTypeId,
                shareId,
                numberOfTables,
                tablesByGameIndex,
                numberOfLives,
                numberOfGoals,
                pointsForDraw,
                pointsForWin,
                playerModification,
                createdAt,
                updatedAt,
                games,
                players: playerIds,
            },
        };
        res.status(StatusCodesOkay.OK).json(resBody);
    }
);

export const getTournamentExportData = asyncWrapper(
    async (
        req: RequestWithUserId<{ id: string }>,
        res: Response
    ): Promise<void> => {
        const { id: idFromParam } = req.params;
        const {
            name,
            sets,
            draw,
            tournamentTypeId,
            monsterDYP,
            numberOfLives,
            numberOfTables,
            tablesByGameIndex,
            numberOfGoals,
            pointsForDraw,
            pointsForWin,
            playerModification,
            games,
            players,
        } = await tournamentService.getTournamentExportDataById(
            parseInt(idFromParam, 10),
            req.userId
        );
        const resBody: ResBody<TournamentJSONData> = {
            success: true,
            data: {
                name,
                sets,
                draw,
                monsterDYP,
                tournamentTypeId,
                numberOfLives,
                numberOfTables,
                tablesByGameIndex,
                numberOfGoals,
                pointsForDraw,
                pointsForWin,
                playerModification,
                games,
                players,
            },
        };
        res.status(StatusCodesOkay.OK).json(resBody);
    }
);

export const createTournament = asyncWrapper(
    async (req: RequestWithUserId, res: Response): Promise<void> => {
        const reqData = req.body as TournamentCreateData;
        const data = await tournamentService.createTournament({
            ...reqData,
            userId: req.userId,
        });
        const resBody: ResBody<TournamentResData> = {
            success: true,
            data,
        };
        res.status(StatusCodesOkay.Created).json(resBody);
    }
);

export const importTournament = asyncWrapper(
    async (req: RequestWithUserId, res: Response): Promise<void> => {
        const data = req.body as TournamentJSONData;
        const {
            id,
            name,
            userId,
            sets,
            draw,
            monsterDYP,
            tournamentTypeId,
            numberOfTables,
            tablesByGameIndex,
            numberOfLives,
            numberOfGoals,
            pointsForDraw,
            pointsForWin,
            playerModification,
            createdAt,
            updatedAt,
            games,
            players,
        } = await tournamentService.importTournament({
            ...data,
            userId: req.userId,
        });
        const playerIds = players.map((val) => val.id);
        const resBody: ResBody<TournamentResData> = {
            success: true,
            data: {
                id,
                name,
                userId,
                sets,
                draw,
                monsterDYP,
                tournamentTypeId,
                numberOfTables,
                tablesByGameIndex,
                numberOfLives,
                numberOfGoals,
                pointsForDraw,
                pointsForWin,
                playerModification,
                createdAt,
                updatedAt,
                games,
                players: playerIds,
            },
        };
        res.status(StatusCodesOkay.Created).json(resBody);
    }
);

export const editTournament = asyncWrapper(
    async (
        req: RequestWithUserId<{ id: number }>,
        res: Response
    ): Promise<void> => {
        const data = req.body as TournamentUpdateData;
        const {
            id,
            name,
            userId,
            sets,
            draw,
            monsterDYP,
            numberOfTables,
            tablesByGameIndex,
            numberOfLives,
            numberOfGoals,
            pointsForDraw,
            pointsForWin,
            playerModification,
            createdAt,
            updatedAt,
            games,
            shareId,
        } = await tournamentService.updateTournament({
            ...data,
            userId: req.userId,
        });
        const resBody: ResBody<TournamentResData> = {
            success: true,
            data: {
                id,
                name,
                userId,
                sets,
                draw,
                monsterDYP,
                numberOfTables,
                tablesByGameIndex,
                numberOfLives,
                numberOfGoals,
                pointsForDraw,
                pointsForWin,
                playerModification,
                createdAt,
                updatedAt,
                games,
            },
        };
        if (global.socket && shareId) {
            global.socket.emit(shareId);
        }
        res.status(StatusCodesOkay.OK).json(resBody);
    }
);

export const deleteTournament = asyncWrapper(
    async (
        req: RequestWithUserId<{ id: string }>,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;
        await tournamentService.deleteTournament({
            id: parseInt(id, 10),
            userId: req.userId,
        });
        const resBody: ResBody<{ id: number }> = {
            success: true,
            data: { id: parseInt(id, 10) },
        };
        res.status(StatusCodesOkay.OK).json(resBody);
    }
);

export const createGames = asyncWrapper(
    async (req: RequestWithUserId, res: Response): Promise<void> => {
        const data = req.body as GamesCreateData;
        const gamesData = await tournamentService.createTournamentGames(data);
        const resBody: ResBody<TournamentGamesData> = {
            success: true,
            data: gamesData,
        };
        res.status(StatusCodesOkay.Created).json(resBody);
    }
);

export const createNewLMSRound = asyncWrapper(
    async (req: RequestWithUserId, res: Response): Promise<void> => {
        const { tournamentId } = req.body as { tournamentId: number };
        const data = await tournamentService.createNextLMSRound(
            tournamentId,
            req.userId
        );
        const resBody: ResBody<GamesResData> = {
            success: true,
            data: { [tournamentId]: data.games },
        };
        if (global.socket && data.shareId) {
            global.socket.emit(data.shareId);
        }
        res.status(StatusCodesOkay.Created).json(resBody);
    }
);

export const giveTournamentShareAccess = asyncWrapper(
    async (
        req: RequestWithUserId<{ id: string }>,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;
        const { shareId } = await tournamentService.giveTournamentShareAccess({
            id: parseInt(id, 10),
            userId: req.userId,
        });
        const resBody: ResBody<{ shareId: string }> = {
            success: true,
            data: { shareId },
        };
        res.status(StatusCodesOkay.OK).json(resBody);
    }
);

export const revokeTournamentShareAccess = asyncWrapper(
    async (
        req: RequestWithUserId<{ id: string }>,
        res: Response
    ): Promise<void> => {
        const { id } = req.params;
        await tournamentService.revokeTournamentShareAccess({
            id: parseInt(id, 10),
            userId: req.userId,
        });
        const resBody: ResBody = {
            success: true,
        };
        res.status(StatusCodesOkay.OK).json(resBody);
    }
);
