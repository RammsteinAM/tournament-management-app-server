import Joi from "joi";
import BadRequestError from "../../errors/BadRequestError";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import { UserInstanceData } from "../user/user.types";

type ValidationSchemas = {
    [schema: string]: Joi.ObjectSchema
}

const validationSchemas: ValidationSchemas = {
    login: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
    userCreate: Joi.object({
        displayName: Joi.string().trim(),
        email: Joi.string().trim().required().email(),
        password: Joi.string()
            .required()
            .min(8)
            .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{3,}/),
    }),
    userUpdate: Joi.object({
        password: Joi.string()
            .required()
            .min(8)
            .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{3,}/),
    }),
}

export const validateUserCreate = (data: UserInstanceData): boolean => {
    const { error } = validationSchemas.userCreate.validate({ email: data.email, password: data.password });
    if (error) {
        const accessor = error.details[0].path[0] as string;
        throw new BadRequestError(`${capitalizeFirstLetter(accessor)} validation failed`, "ValidationError");
    }
    return true;
}

export const validateUserUpdate = (data: UserInstanceData): boolean => {
    const { error } = validationSchemas.userUpdate.validate({ password: data.password });
    if (error) {
        const accessor = error.details[0].path[0] as string;
        throw new BadRequestError(`${capitalizeFirstLetter(accessor)} validation failed`, "ValidationError");
    }
    return true;
}