import * as jwt from "jsonwebtoken";
import UnauthorizedError from "../errors/UnauthorizedError";
import { ErrorNames } from "../types/errorNames";

export const getDecoded = (token: string): any => {
    try {
        return jwt.verify(
            token,
            `${process.env.JWT_SECRET_KEY}`
        );
    } catch (ignored) {
        throw new UnauthorizedError(ErrorNames.Unauthorized, "Unauthorized");
    }
};

export const createToken = (id: string): string => {
    return jwt.sign({id}, `${process.env.JWT_SECRET_KEY}`, {
        expiresIn: '1d',
    });
}