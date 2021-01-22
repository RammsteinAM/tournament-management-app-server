import { Router } from "express";
import { googleLoginOrRegister, facebookLoginOrRegister } from "./social.controller";

const router = Router();

router.route("/google")
    .post(googleLoginOrRegister);

router.route("/facebook")
    .post(facebookLoginOrRegister);



export default router;