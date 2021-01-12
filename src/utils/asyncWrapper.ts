import { Prisma, prismaVersion } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from '../../prisma/prisma';
import { AuthRequest } from "../types/main";

export const asyncWrapper = (func: (req: Request<any>, res: Response, next: NextFunction) => Promise<void>) =>
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