import { Prisma, prismaVersion } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from '../../prisma/prisma';

export const asyncWrapper = (func: (req: Request, res: Response, next: NextFunction) => void) =>
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