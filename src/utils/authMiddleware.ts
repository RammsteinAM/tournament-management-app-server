import { Response, NextFunction } from "express";
import { RequestWithUserId } from "../types/main";
import ForbiddenError from "../errors/ForbiddenError";
import { DecodedTokenData } from "../modules/auth/auth.types";
import { getVerifiedData } from "./jwtTokenUtils";
import { ErrorNames } from "../types/error";

export const authorize = async (req: RequestWithUserId, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = req.cookies["x-auth-token"];
        if (!accessToken) throw new ForbiddenError("No token provided", ErrorNames.InvalidToken);

        const tokenData: DecodedTokenData = getVerifiedData(`${accessToken}`, process.env.ACCESS_TOKEN_SECRET);
        if (!tokenData) throw new ForbiddenError("Invalid Token Data", ErrorNames.InvalidToken);
        req.userId = tokenData.id;
        next();
    }
    catch (error) {
        next(error);
    }
};