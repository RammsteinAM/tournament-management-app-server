import { StatusCodesError } from "../../src/types/status";

abstract class BaseError extends Error {
    readonly status: number;

    constructor(status: StatusCodesError, message: string, name: string) {
        super(message);
        this.status = status;
        this.name = name;
    }
}

export default BaseError;