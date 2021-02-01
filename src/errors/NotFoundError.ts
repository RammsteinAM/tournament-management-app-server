import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/error";
import BaseError from "./BaseError";

class NotFoundError extends BaseError {
    constructor( message: string = "Not Found", name: ErrorNames = ErrorNames.NotFound) {
        super(StatusCodesError.NotFound, message, name);
    }
}

export default NotFoundError;