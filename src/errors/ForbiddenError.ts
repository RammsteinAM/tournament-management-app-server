import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/error";
import BaseError from "./BaseError";

class ForbiddenError extends BaseError {
    constructor(message: string = "Forbidden", name: ErrorNames = ErrorNames.Forbidden) {
        super(StatusCodesError.Forbidden, message, name);
    }
}

export default ForbiddenError;