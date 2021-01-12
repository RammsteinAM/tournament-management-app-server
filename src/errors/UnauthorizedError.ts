import { StatusCodesError } from "../../src/types/status";
import BaseError from "./BaseError";

class UnauthorizedError extends BaseError {
    constructor(message: string = "Unauthorized", name: string = "UnauthorizedError") {
        super(StatusCodesError.Unauthorized, message, name);
    }
}

export default UnauthorizedError;