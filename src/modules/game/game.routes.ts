import { Router } from "express";
import { authorize } from "../../utils/authMiddleware";
import { getGame, getGames, editGame, editGameAndNextGames, deleteGame } from "./game.controller";

const router = Router();

router.route("/")
  .get(authorize, getGames);

router.route("/:id")
  .get(authorize, getGame)
  .put(authorize, editGame)
  .delete(authorize, deleteGame);

router.route("/update-with-nexts/:id")
  .put(authorize, editGameAndNextGames);

export default router;