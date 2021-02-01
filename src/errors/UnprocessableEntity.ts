import { StatusCodesError } from "../../src/types/status";
import { ErrorNames } from "../types/error";
import BaseError from "./BaseError";

class UnprocessableEntity extends BaseError {
    constructor(message: string = "Unprocessable Entity", name: ErrorNames = ErrorNames.UnprocessableEntity) {
        super(StatusCodesError.UnprocessableEntity, message, name);
    }
}

export default UnprocessableEntity;