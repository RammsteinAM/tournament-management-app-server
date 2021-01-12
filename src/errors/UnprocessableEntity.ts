import { StatusCodesError } from "../../src/types/status";
import BaseError from "./BaseError";

class UnauthorizedError extends BaseError {
    constructor(message: string = "Unprocessable Entity", name: string = "UnprocessableEntityError") {
        super(StatusCodesError.UnprocessableEntity, message, name);
    }
}

export default UnauthorizedError;