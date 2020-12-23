import { StatusCodesError } from "../../src/types/status";
import BaseError from "./BaseError";

class BadRequestError extends BaseError {
    constructor(name: string, message: string) {
        super(StatusCodesError.BadRequest, name, message);
        // Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export default BadRequestError;