import { Router } from "express";
import { authorize } from "../../utils/authMiddleware";
import { getGame, getGames, createGame, createGames, editGame, deleteGame } from "./game.controller";

const router = Router();

router.route("/")
  .get(authorize, getGames)
  .post(authorize, createGame);

router.route("/create-many")
  .post(authorize, createGames);


router.route("/:id")
  .get(authorize, getGame)
  .put(authorize, editGame)
  .delete(authorize, deleteGame);
  
export default router;