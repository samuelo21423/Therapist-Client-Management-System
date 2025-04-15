import express from "express";
import {
  getSessions,
  addSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionsController.js";

const router = express.Router();

router.get("/", getSessions); // GET all
router.post("/", addSession); // ADD new session
router.put("/:id", updateSession); // UPDATE session
router.delete("/:id", deleteSession); // DELETE session


export default router;
