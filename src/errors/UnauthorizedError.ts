import { StatusCodesError } from "../../src/types/status";
import BaseError from "./BaseError";

class UnauthorizedError extends BaseError {
    constructor(name: string, message: string) {
        super(StatusCodesError.Unauthorized, name, message);
        // Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export default UnauthorizedError;