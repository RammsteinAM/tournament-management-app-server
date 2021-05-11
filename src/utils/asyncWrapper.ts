import { NextFunction, Request, Response } from "express";
import prisma from '../../prisma/prisma';

export const asyncWrapper = <R>(func: (req: Request<any>, res: Response, next: NextFunction) => Promise<R>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await func(req, res, next);
            next();
        } catch (error) {
            next(error);
        } finally {
            prisma.$disconnect();
        }
    };