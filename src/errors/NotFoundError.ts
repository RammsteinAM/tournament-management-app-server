import { StatusCodesError } from "../../src/types/status";
import BaseError from "./BaseError";

class NotFoundError extends BaseError {
    constructor(name: string, message: string) {
        super(StatusCodesError.NotFound, name, message);
        // Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export default NotFoundError;