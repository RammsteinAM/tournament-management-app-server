import { Router } from "express";
import {
    registerUser,
    verifyUser,
    login,
    loginCheck,
    requestVerificationEmail,
    requestAccessToken,
    resetPassword
} from "./auth.controller";

const router = Router();

router.route("/login")
    .post(login);

router.route("/login-check")
    .post(loginCheck);

router.route("/register")
    .post(registerUser);

router.route("/verify/:token")
    .get(verifyUser);

router.route("/resend-mail")
    .post(requestVerificationEmail);

router.route("/reset-password/:token")
    .post(resetPassword);

router.route("/request-access-token")
    .post(requestAccessToken);

export default router;