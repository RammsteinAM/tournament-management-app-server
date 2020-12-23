import { Router } from "express";
import { getUserById, createUser, verifyUser, signIn } from "./user.controller";

const router = Router();

router.route("/")
  .get(getUserById)
  .post(createUser);

  router.route("/verify:code")
  .get(verifyUser)

  router.route("/auth")
  .post(signIn)

// router.route("/:id")
//   .get(getTodo)
//   .put(updateTodo)
//   .delete(deleteTodo);

export default router;