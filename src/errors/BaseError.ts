import { StatusCodesError } from "../../src/types/status";

class BaseError extends Error {
    public readonly status: number;

    constructor(status: StatusCodesError, name: string, message: string) {
        super(message);
        this.status = status;
        this.name = name;
        // Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export default BaseError;