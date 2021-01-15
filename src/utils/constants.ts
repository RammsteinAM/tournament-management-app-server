const mainRoute = process.env.API_ROUTE;

export const mailSendRoutes = {
    verification: `${mainRoute}auth/verify/`, // TODO
    passwordReset: `${mainRoute}auth/passwordreset/`, // TODO
    deleteAccount: `${mainRoute}user/`, // TODO
}