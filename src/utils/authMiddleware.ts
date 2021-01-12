import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/main";
import UnauthorizedError from "../errors/UnauthorizedError";
import { DecodedTokenData } from "../modules/user/user.types";
import { getVerifiedData } from "./jwtTokenUtils";

export const authorize = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = req.cookies["x-auth-token"];
        if (!accessToken) throw new UnauthorizedError("No token provided");

        const tokenData: DecodedTokenData = getVerifiedData(`${accessToken}`, process.env.ACCESS_TOKEN_SECRET);
        if (!tokenData) throw new UnauthorizedError();
        req.userId = tokenData.id;
        next();
    }
    catch (error) {
        next(error);
    }
};