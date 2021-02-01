import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/error";
import BaseError from "./BaseError";

class InternalServerError extends BaseError {
    constructor(message: string = "Internal Server Error", name: ErrorNames = ErrorNames.Internal) {
        super(StatusCodesError.BadRequest, message, name);
    }
}

export default InternalServerError;