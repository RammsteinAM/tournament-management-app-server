import { Router } from "express";
import { authorize } from "../../utils/authMiddleware";
import {
    registerUser,
    checkEmail,
    verifyUser,
    login,
    loginCheck,
    requestVerificationEmail,
    checkAccessToken,
    requestPasswordResetEmail,
    resetPassword,
    getUser,
    editUser,
    deleteUserEmailRequest,
    deleteUser,
} from "./auth.controller";

const router = Router();

router.route("/")
    .get(authorize, getUser)
    .put(authorize, editUser);

router.route("/:token")
    .delete(deleteUser);

router.route("/login")
    .post(login);

router.route("/login-check")
    .post(loginCheck);

router.route("/register")
    .post(registerUser);

router.route("/email-check")
    .post(checkEmail);

router.route("/verify/:token")
    .get(verifyUser);

router.route("/resend-mail")
    .post(requestVerificationEmail);

router.route("/forgot-password")
    .post(requestPasswordResetEmail);

router.route("/delete-account-request")
    .get(authorize, deleteUserEmailRequest);

router.route("/check-access-token")
    .post(authorize, checkAccessToken);

router.route("/reset-password/:token")
    .post(resetPassword);

export default router;