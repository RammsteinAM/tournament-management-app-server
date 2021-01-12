import { NextFunction, Request, Response } from "express";
import BaseError from "../../src/errors/BaseError";
import { StatusCodesError } from "../../src/types/status";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {
    let status = StatusCodesError.InternalServerError;
    let message: string = "Internal Server Error";

    console.log(err);
    console.log("err instanceof BaseError: ", err instanceof BaseError);

    if (err instanceof BaseError) {
        status = err.status;
        message = err.message;
    }

    return res.status(status).send({
        success: false,
        error: message,
    });
};
export default errorHandler;