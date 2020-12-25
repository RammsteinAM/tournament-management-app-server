import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/errorNames";
import BaseError from "./BaseError";

class UnauthorizedError extends BaseError {
    constructor(name: string = ErrorNames.UnprocessableEntity, message: string = "Unprocessable Entity") {
        super(StatusCodesError.Unauthorized, name, message);
        // Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export default UnauthorizedError;