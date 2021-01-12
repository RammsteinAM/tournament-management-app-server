import { StatusCodesError } from "../../src/types/status";
import BaseError from "./BaseError";

class UnauthorizedError extends BaseError {
    constructor(message: string = "Forbidden", name: string = "ForbiddenError") {
        super(StatusCodesError.Forbidden, message, name);
    }
}

export default UnauthorizedError;