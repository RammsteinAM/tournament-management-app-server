import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/error";
import BaseError from "./BaseError";

class BadRequestError extends BaseError {
    constructor(message: string = "Bad Request", name: ErrorNames = ErrorNames.BadRequest) {
        super(StatusCodesError.BadRequest, message, name);
    }
}

export default BadRequestError;