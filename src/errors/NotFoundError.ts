import { StatusCodesError } from "../../src/types/status";
import BaseError from "./BaseError";

class NotFoundError extends BaseError {
    constructor( message: string = "Not Found", name: string = "NotFoundError") {
        super(StatusCodesError.NotFound, message, name);
    }
}

export default NotFoundError;