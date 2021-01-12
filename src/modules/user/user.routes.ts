import { Router } from "express";
import { authorize } from "../../utils/authMiddleware";
import  { getUser, deleteUser } from "./user.controller";

const router = Router();

router.route("/:id")
  .get(authorize, getUser)
  .delete(deleteUser);

export default router;