import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/error";
import BaseError from "./BaseError";

class UnauthorizedError extends BaseError {
    constructor(message: string = "Unauthorized", name: ErrorNames = ErrorNames.Unauthorized) {
        super(StatusCodesError.Unauthorized, message, name);
    }
}

export default UnauthorizedError;