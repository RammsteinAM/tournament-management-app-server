export enum StatusCodesOkay {
    OK = 200,
    Created = 201,
    NoContent = 204
}

export enum StatusCodesError {
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    UnprocessableEntity = 422,
    InternalServerError = 500
}