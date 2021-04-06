import { Router } from "express";
import { authorize } from "../../utils/authMiddleware";
import { getTournaments, getTournament, createTournament, editTournament, deleteTournament, createGames } from "./tournament.controller";

const router = Router();

router.route("/")
  .get(authorize, getTournaments)
  .post(authorize, createTournament);

router.route("/create-games")
  .post(authorize, createGames);


router.route("/:id")
  .get(authorize, getTournament)
  .put(authorize, editTournament)
  .delete(authorize, deleteTournament);
  
export default router;