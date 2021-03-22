const mainRoute = process.env.CLIENT_URL;

export const mailSendRoutes = {
    verification: `${mainRoute}verify-email/`,
    passwordReset: `${mainRoute}reset-password/`,
    deleteAccount: `${mainRoute}delete-account/`,
}