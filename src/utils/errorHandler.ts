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

    console.log("err instanceof BaseError: ", err instanceof BaseError);

    if (err instanceof BaseError) {
        status = err.status;
        message = err.message;
    }
    // else if (err instanceof Error) {
    //     status = 400;
    //     message = err.message;
    // }
    // if (err.name === "CastError") {
    //     status = 404;
    //     message = "Not Found";
    // }

    return res.status(status).json({
        error: message,
    });
};
export default errorHandler;