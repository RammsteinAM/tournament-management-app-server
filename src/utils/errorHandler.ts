import { NextFunction, Request, Response } from "express";
import BaseError from "../../src/errors/BaseError";
import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/error";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    let status = StatusCodesError.InternalServerError;
    let error: ErrorNames = ErrorNames.Internal;
    let message: string = "Internal Server Error";

    console.error(err);
    console.error("err instanceof BaseError: ", err instanceof BaseError);

    if (err instanceof BaseError) {
        status = err.status;
        error = err.name;
        message = err.message;
    }

    return res.status(status).send({
        success: false,
        error: error.toString(),
        message
    });
};
export default errorHandler;