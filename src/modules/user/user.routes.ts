import { Router } from "express";
import { authorize } from "../../utils/authMiddleware";
import { getUser, editUser, deleteUser, requestPasswordResetEmail } from "./user.controller";

const router = Router();

router.route("/:id")
  .get(authorize, getUser)
  .put(authorize, editUser)
  .delete(deleteUser);

router.route("/forgot-password")
  .post(requestPasswordResetEmail);

export default router;