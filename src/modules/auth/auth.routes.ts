import { Router } from "express";
import { registerUser, verifyUser, login, requestVerificationEmail, requestAccessToken } from "./auth.controller";

const router = Router();

router.route("/login")
    .post(login);

router.route("/register")
    .post(registerUser);

router.route("/verify/:token")
    .get(verifyUser);

router.route("/resendmail")
    .post(requestVerificationEmail);
    
router.route("/requestaccesstoken")
.post(requestAccessToken);

export default router;