import UnauthorizedError from "../errors/UnauthorizedError";

export enum ErrorNames {
    Registration = "REGISTRATION_ERROR",
    NotFound = "NOT_FOUND_ERROR",
    NotVerified = "NOT_VERIFIED_ERROR",
    AlreadyVerified = "ALREADY_VERIFIED_ERROR",
    Unauthorized = "UNAUTHORIZED_ERROR",
    IncorrectPassword = "INCORRECT_PASSWORD_ERROR",
    BadReques = "BAD_REQUEST_ERROR",
    ValidationError = "VALIDATION_ERROR",
}