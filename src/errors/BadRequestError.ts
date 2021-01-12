import { StatusCodesError } from "../../src/types/status";
import BaseError from "./BaseError";

class BadRequestError extends BaseError {
    constructor(message: string = "Bad Request", name: string = "BadRequestError") {
        super(StatusCodesError.BadRequest, message, name);
    }
}

export default BadRequestError;