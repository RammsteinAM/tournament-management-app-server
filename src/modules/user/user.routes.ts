import { Router } from "express";
import { getUserById, registerUser, verifyUser, signIn } from "./user.controller";

const router = Router();

router.route("/")
  .get(getUserById)
  .post(registerUser);

  router.route("/verify/:token")
  .get(verifyUser)

  router.route("/auth")
  .post(signIn)

// router.route("/:id")
//   .get(getTodo)
//   .put(updateTodo)
//   .delete(deleteTodo);

export default router;