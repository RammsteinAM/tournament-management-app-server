import { EmailLocalization } from "../types/main";

const appName = "TourTool";

export const emailLocalizations: EmailLocalization = {
    en: {
        verifyButtonText: "Verify",
        verificationSubject: `${appName} - Email Verification`,
        verificationMessage: (name) => (
            `Dear ${name},

            Welcome to ${appName}.
            To finish the registration please verify your Email address by clicking on the button below:`
        ),
        passwordResetButtonText: "Reset Password",
        passwordResetSubject: `${appName} - Password Reset`,
        passwordResetMessage: (name) => (
            `Dear ${name},

            Please click on the button below to reset your password.
            If you didn't request a password reset, simply ignore this email.`
        ),
        deleteAccountButtonText: "Delete my Account",
        deleteAccountSubject: `${appName} - Delete Account`,
        deleteAccountMessage: (name) => (
            `Dear ${name},

            We received your request to delete your ${appName} account.
            Please note that all your ${appName} data will be permanently deleted.
            If you're sure you want it to happen, please click on the button below.`
        ),
        accountDeletedSubject: `${appName} - Account Deleted`,
        accountDeletedMessage: `Your ${appName} account has been successfully deleted.`,
    },
    hy: {
        verifyButtonText: "Հաստատել",
        verificationSubject: `${appName} - էլ. փոստի հաստատում`,
        verificationMessage: (name) => (
            `Հարգելի ${name},

            Բարի գալուստ ${appName}։
            Գրանցումն ավարտելու համար խնդրում ենք հաստատել Ձեր էլ. փոստի հասցեն՝ սեղմելով հետևյալ կոճակը.`
        ),
        passwordResetButtonText: "Վերակայել գաղտնաբառը",
        passwordResetSubject: `${appName} - Գաղտնաբառի վերակայում`,
        passwordResetMessage: (name) => (
            `Հարգելի ${name},

            Գաղտնաբառի վերակայման համար խնդրում ենք սեղմել կոճակը ստորև։
            Եթե Դուք չեք կատարել գաղտնաբառի վերակայման հարցում, ընդամենը անտեսեք այս նամակը։`
        ),
        deleteAccountButtonText: "Ջնջել իմ հաշիվը",
        deleteAccountSubject: `${appName} - Հաշվի ջնջում`,
        deleteAccountMessage: (name) => (
            `Հարգելի ${name},

            Մենք ստացանք ${appName}-ի Ձեր հաշիվը ջնջելու դիմումը։
            Խնդրում ենք նկատի ունենալ, որ ${appName}-ի Ձեր բոլոր տվյալներն անվերադարձ կջնջվեն։
            Եթե համոզված եք, որ հենց դա եք ուզում, խնդրում ենք սեղմել կոճակը ստորև։`
        ),
        accountDeletedSubject: `${appName} - Հաշիվը ջնջված է`,
        accountDeletedMessage: `${appName}-ի Ձեր հաշիվը հաջողությամբ ջնջվել է։`,
    },
    ru: {
        verifyButtonText: "Подтвердить",
        verificationSubject: `${appName} - Подтверждение адреса электронной почты`,
        verificationMessage: (name) => (
            `Уважаемый (ая) ${name},

            Добро пожаловать в ${appName}.
            Чтобы завершить регистрацию, подтвердите свой адрес электронной почты, нажимая кнопку ниже:`
        ),
        passwordResetButtonText: "Сбросить пароль",
        passwordResetSubject: `${appName} - Сброс пароля`,
        passwordResetMessage: (name) => (
            `Уважаемый (ая) ${name},

            Чтобы выбрать новый пароль нажмите кнопку ниже.
            Если вы не запрашивали сброс пароля, просто проигнорируйте это сообщение.`
        ),
        deleteAccountButtonText: "Удалить учётную запись",
        deleteAccountSubject: `${appName} - Удаление учётной записи`,
        deleteAccountMessage: (name) => (
            `Уважаемый (ая) ${name},

            Мы получили ваш запрос на удаление вашей учетной записи ${appName}.
            Обратите внимание, что все ваши данные будут удалены без возможности восстановления.
            Если вы уверены, что хотите именно этого, нажмите кнопку ниже.`
        ),
        accountDeletedSubject: `${appName} - Учётная запись удалена`,
        accountDeletedMessage: `Ваша учётная запись ${appName} была успешно удалена.`,
    },
}