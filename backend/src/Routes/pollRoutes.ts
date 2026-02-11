import { Router } from "express";
import { pollController } from "../Controllers/PollController.js";

const router = Router();

router.post("/create", pollController.createPoll);

router.get('/active', pollController.getActivePoll);

router.get('/active', pollController.getActivePoll);
export default router;