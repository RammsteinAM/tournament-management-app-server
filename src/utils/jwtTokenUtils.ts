import * as jwt from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError";
import { DecodedTokenData } from "../modules/user/user.types";
import { ErrorNames } from "../types/errorNames";

const secretKey = process.env.JWT_SECRET_KEY;

export const createUserVerificationToken = (email: string): string => {
    return jwt.sign({ email }, secretKey, {
        expiresIn: '10m',
    });
}

export const getTokenData = (token: string): DecodedTokenData => {
    try {
        return jwt.verify(token, secretKey) as DecodedTokenData;
    }
    catch (error) {
        throw new UnauthorizedError();
    }
};