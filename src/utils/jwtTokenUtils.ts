import * as jwt from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError";
import { DecodedTokenData } from "../modules/user/user.types";
import { TokenDurationFor } from "../types/main";

export const createToken = (id: number, secret: string, expiresIn: TokenDurationFor): string => {
    return jwt.sign({ id }, secret, { expiresIn });
}

export const getVerifiedData = (token: string, secret: string): DecodedTokenData => {
    try {
        return jwt.verify(token, secret) as DecodedTokenData;
    }
    catch (error) {
        throw new UnauthorizedError();
    }
};