import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/error";

abstract class BaseError extends Error {
    readonly status: number;
    readonly name: ErrorNames;
    constructor(status: StatusCodesError, message: string, name: ErrorNames) {
        super(message);
        this.status = status;
        this.name = name;
    }
}

export default BaseError;