import sgMail, { MailDataRequired } from '@sendgrid/mail';
import InternalServerError from '../errors/InternalServerError';
import { ErrorNames } from '../types/error';
import { EmailMessage, EmailWithButtonMessage, Locales } from '../types/main';
import { mailSendRoutes } from './constants';
import { emailLocalizations } from './localizationUtils';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const generateVerificationEmail = (email: string, displayName: string, token: string, locale: keyof typeof Locales) => {
    const name = displayName || email;

    const message: EmailWithButtonMessage = {
        to: email,
        from: process.env.SENDGRID_SENDER,
        templateId: "d-f1b7f509d3ce40e18cc69b22dd6d9aec",
        dynamicTemplateData: {
            subject: emailLocalizations[locale].verificationSubject,
            message: emailLocalizations[locale].verificationMessage(name),
            btnText: emailLocalizations[locale].verifyButtonText,
            link: `${mailSendRoutes.verification}${token}`
        }
    }
    return message;
}

export const generatePasswordResetEmail = (email: string, displayName: string, token: string, locale: keyof typeof Locales) => {
    const name = displayName || email;

    const message: EmailWithButtonMessage = {
        to: email,
        from: process.env.SENDGRID_SENDER,
        templateId: "d-f1b7f509d3ce40e18cc69b22dd6d9aec",
        dynamicTemplateData: {
            subject: emailLocalizations[locale].passwordResetSubject,
            message: emailLocalizations[locale].passwordResetMessage(name),
            btnText: emailLocalizations[locale].passwordResetButtonText,
            link: `${mailSendRoutes.passwordReset}${token}`
        }
    }
    return message;
}

export const generateDeleteAccountEmail = (email: string, displayName: string, token: string, locale: keyof typeof Locales) => {
    const name = displayName || email;

    const message: EmailWithButtonMessage = {
        to: email,
        from: process.env.SENDGRID_SENDER,
        templateId: "d-59ff9ae7b8d14729b3ed22ba4c53313b",
        dynamicTemplateData: {
            subject: emailLocalizations[locale].deleteAccountSubject,
            message: emailLocalizations[locale].deleteAccountMessage(name),
            btnText: emailLocalizations[locale].deleteAccountButtonText,
            link: `${mailSendRoutes.deleteAccount}${token}`
        }
    }
    return message;
}

export const generateAccountDeletedEmail = (email: string, locale: keyof typeof Locales) => {
    const message: EmailMessage = {
        to: email,
        from: process.env.SENDGRID_SENDER,
        templateId: "d-aecaca474e4f447db833776c47f58980",
        dynamicTemplateData: {
            subject: emailLocalizations[locale].accountDeletedSubject,
            message: emailLocalizations[locale].accountDeletedMessage,
        }
    }
    return message;
}

export const sendEmail = async (message: any): Promise<void> => {
    try {
        await sgMail.send(message);
    } catch (error) {
        throw new InternalServerError("Error Sending Email", ErrorNames.MailSend);
    }
};
