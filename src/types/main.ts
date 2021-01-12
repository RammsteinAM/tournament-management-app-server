import { Request } from "express";
import * as core from "express-serve-static-core";

export type Nullable<T> = T | null;

export enum Locales {
    en = "en",
    hy = "hy",
    ru = "ru",
}
interface EmailLocalizationLang {
    verifyButtonText: string;
    verificationSubject: string;
    verificationMessage: (name: string) => string;
}

export type EmailLocalization = {
    [Locale in Locales]: EmailLocalizationLang
}
export interface EmailMessage {
    to: string;
    from: string;
    templateId: string;
    dynamicTemplateData: EmailDynamicTemplateData
}

interface EmailDynamicTemplateData {
    subject: string;
    message: string;
    verifyBtnText: string;
    verificationLink: string
}

export type AuthRequest<T = core.ParamsDictionary> = Request<T>
    & { userId: number }
export interface ReqBody<DataType = undefined> {
    success: boolean;
    data?: DataType;
    message?: string;
    error?: string;
}

export enum TokenDurationFor {
    Verification = "5m",
    Access = "20m",
    Refresh = "180d",
}
