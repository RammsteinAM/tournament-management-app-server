import { EmailLocalization } from "../types/main";

const appName = "TourTool";

export const emailLocalizations: EmailLocalization = {
    en: {
        verifyButtonText: "Verify",
        verificationSubject: `${appName} Email Verification`,
        verificationMessage: (name) => (
            `Dear ${name},

            Welcome to ${appName}.
            To finish the registration please verify your Email address by clicking the following button:`
        )
    },
    hy: {
        verifyButtonText: "Հաստատել",
        verificationSubject: `${appName} էլ. փոստի հաստատում`,
        verificationMessage: (name) => (
            `Հարգելի ${name},

            Բարի գալուստ ${appName}։
            Գրանցումն ավարտելու համար խնդրում ենք հաստատել Ձեր էլ. փոստի հասցեն՝ սեղմելով հետևյալ կոճակը.`
        ),
    },
    ru: {
        verifyButtonText: "Подтвердить",
        verificationSubject: `${appName} подтверждение адреса электронной почты`,
        verificationMessage: (name) => (
            `Уважаемый (ая) ${name},

            Добро пожаловать в ${appName}.
            Чтобы завершить регистрацию, подтвердите свой адрес электронной почты, нажимая кнопку ниже:`
        ),
    },
}