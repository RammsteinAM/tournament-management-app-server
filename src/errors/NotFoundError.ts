import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/errorNames";
import BaseError from "./BaseError";

class NotFoundError extends BaseError {
    constructor(name: string = ErrorNames.NotFound, message: string = "Not Found") {
        super(StatusCodesError.NotFound, name, message);
        // Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export default NotFoundError;