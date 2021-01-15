import { Router } from "express";
import { googleLoginOrRegister, facebookLoginOrRegister } from "./social.controller";

const router = Router();

router.route("/google")
    .post(googleLoginOrRegister);

router.route("/facebook")
    .post(facebookLoginOrRegister);

// router.route("/register")
//     .post(registerUser);

// router.route("/verify/:token")
//     .get(verifyUser);

// router.route("/requestaccesstoken")
// .post(requestAccessToken);

export default router;