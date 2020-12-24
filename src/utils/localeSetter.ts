import { NextFunction, Request, Response } from "express";
import { Locales } from "../types/main";

const localeSetter = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    process.env.LOCALE = Locales.en;
    const locale = req.query.lang?.toString();
    if (Object.values(Locales).includes(locale as Locales)) {
        process.env.LOCALE = locale;
    }
    next();
};

export default localeSetter;