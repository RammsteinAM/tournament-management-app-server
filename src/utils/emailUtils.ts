import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { EmailMessage, Locales } from '../types/main';
import { emailLocalizations } from './localizationUtils';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const generateVerificationEmail = (email: string, displayName: string, token: string) => {
    const langCode = process.env.LOCALE || Locales.en;
    const locale: keyof typeof Locales = Locales[langCode as Locales];
    const name = displayName || email;

    const message: EmailMessage = {
        to: email,
        from: process.env.SENDGRID_SENDER,
        templateId: "d-f1b7f509d3ce40e18cc69b22dd6d9aec",
        dynamicTemplateData: {
            subject: emailLocalizations[locale].verificationSubject,
            message: emailLocalizations[locale].verificationMessage(name),
            verifyBtnText: emailLocalizations[locale].verifyButtonText,
            verificationLink: `${process.env.EMAIL_VERIFICATION_ROUTE}${token}`
        }
    }
    return message;
}

export const sendVerificationEmail = async (message: any): Promise<void> => {
    await sgMail.send(message);
};
