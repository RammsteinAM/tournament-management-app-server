import { Router } from "express";
import { authorize } from "../../utils/authMiddleware";
import { getTournaments, getTournament, createTournament, editTournament, deleteTournament, createGames, createNewLMSRound, getTournamentExportData, importTournament, giveTournamentShareAccess, revokeTournamentShareAccess } from "./tournament.controller";

const router = Router();

router.route("/")
  .get(authorize, getTournaments)
  .post(authorize, createTournament);

router.route("/create-round")
  .post(authorize, createNewLMSRound);

router.route("/create-games")
  .post(authorize, createGames);

router.route("/:id")
  .get(authorize, getTournament)
  .put(authorize, editTournament)
  .delete(authorize, deleteTournament);

router.route("/json/:id")
  .get(authorize, getTournamentExportData)

router.route("/json/")
  .post(authorize, importTournament);

router.route("/share-on/:id")
  .get(authorize, giveTournamentShareAccess);

router.route("/share-off/:id")
  .get(authorize, revokeTournamentShareAccess);

export default router;