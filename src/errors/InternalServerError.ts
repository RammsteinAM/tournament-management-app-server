import { StatusCodesError } from "../../src/types/status";
import BaseError from "./BaseError";

class InternalServerError extends BaseError {
    constructor(message: string = "Internal Server Error", name: string = "InternalServerError") {
        super(StatusCodesError.BadRequest, message, name);
    }
}

export default InternalServerError;