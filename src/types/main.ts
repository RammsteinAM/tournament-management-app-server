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
    passwordResetButtonText: string;
    passwordResetSubject: string;
    passwordResetMessage: (name: string) => string;
    deleteAccountButtonText: string;
    deleteAccountSubject: string;
    deleteAccountMessage: (name: string) => string;
    accountDeletedSubject: string;
    accountDeletedMessage: string;
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

export interface EmailWithButtonMessage {
    to: string;
    from: string;
    templateId: string;
    dynamicTemplateData: EmailWithButtonDynamicTemplateData
}

interface EmailDynamicTemplateData {
    subject: string;
    message: string;
}

interface EmailWithButtonDynamicTemplateData extends EmailDynamicTemplateData {
    link: string;
    btnText: string;
}

export type RequestWithUserId<T = core.ParamsDictionary> = Request<T>
    & { userId: number }

export interface ResBody<DataType = undefined> {
    success: boolean;
    data?: DataType;
    message?: string;
    error?: string;
}

export enum TokenDurationFor {
    Verification = "5m",
    Access = "20m",
    PasswordReset = "30m",
    DeleteAccount = "30m",
    Refresh = "180d",
}
