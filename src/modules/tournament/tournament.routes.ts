import { Router } from "express";
import { authorize } from "../../utils/authMiddleware";
import { getTournaments, getTournament, createTournament, editTournament, /* deleteTournament */ } from "./tournament.controller";

const router = Router();

router.route("/")
  .get(authorize, getTournaments)
  .post(authorize, createTournament);


router.route("/:id")
  .get(authorize, getTournament)
  .put(authorize, editTournament)
  //.delete(deleteTournament);
  
export default router;