import * as jwt from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError";
import { DecodedTokenData } from "../modules/auth/auth.types";
import { ErrorNames } from "../types/error";
import { TokenDurationFor } from "../types/main";

export const createToken = (id: number, secret: string, expiresIn: TokenDurationFor, social: boolean = false): string => {
    return jwt.sign({ id, social }, secret, { expiresIn });
}

export const verifyTokenData = (token: string, secret: string): DecodedTokenData => {
    return jwt.verify(token, secret) as DecodedTokenData;
};

export const getVerifiedData = (token: string, secret: string): DecodedTokenData => {
    try {
        return verifyTokenData(token, secret);
    }
    catch (error) {
        throw new UnauthorizedError("Provided token is not valid", ErrorNames.InvalidToken);
    }
};