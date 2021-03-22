import { Router } from "express";
import { authorize } from "../../utils/authMiddleware";
import { getPlayer, getPlayers, createPlayer, createPlayers, editPlayer, deletePlayer } from "./player.controller";

const router = Router();

router.route("/")
  .get(authorize, getPlayers)
  .post(authorize, createPlayer);

router.route("/create-many")
  .post(authorize, createPlayers);


router.route("/:id")
  .get(authorize, getPlayer)
  .put(authorize, editPlayer)
  .delete(authorize, deletePlayer);
  
export default router;