import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/errorNames";
import BaseError from "./BaseError";

class BadRequestError extends BaseError {
    constructor(name: string = ErrorNames.BadReques, message: string = "Bad Request") {
        super(StatusCodesError.BadRequest, name, message);
        // Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export default BadRequestError;