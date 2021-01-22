import { Router } from "express";
import {
    registerUser,
    verifyUser,
    login,
    requestVerificationEmail,
    requestAccessToken
} from "./auth.controller";

const router = Router();

router.route("/login")
    .post(login);

router.route("/register")
    .post(registerUser);

router.route("/verify/:token")
    .get(verifyUser);

router.route("/resend-mail")
    .post(requestVerificationEmail);

router.route("/request-access-token")
    .post(requestAccessToken);

export default router;