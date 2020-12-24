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