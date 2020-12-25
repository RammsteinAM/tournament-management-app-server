import { Router } from "express";
import { registerUser, verifyUser, signIn } from "./auth.controller";

const router = Router();

router.route("/")
    .post(signIn)

router.route("/register")
    .post(registerUser);

router.route("/verify/:token")
    .get(verifyUser)

export default router;