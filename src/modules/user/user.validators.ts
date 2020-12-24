import Joi from "joi";
import BadRequestError from "../../errors/BadRequestError";
import { ErrorNames } from "../../types/errorNames";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import { UserData } from "./user.types";

type ValidationSchemas = {
    [schema: string]: Joi.ObjectSchema
}

const validationSchemas: ValidationSchemas = {
    login: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
    userCreate: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string()
            .required()
            .min(8)
            .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{3,}/),
    })
}

export const validateUserCreate = (data: UserData): boolean => {
    const { error } = validationSchemas.userCreate.validate({ email: data.email, password: data.password });
    if (error) {
        const accessor = error.details[0].path[0] as string;
        throw new BadRequestError(ErrorNames.ValidationError, `${capitalizeFirstLetter(accessor)} validation failed`);
    }
    return true;
}


// export const loginSchema = Joi.object({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
// });

// export const userCreateSchema = Joi.object({
//     email: Joi.string().required().email(),
//     password: Joi.string()
//         .required()
//         .min(8)
//         .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{3,}/),
// });