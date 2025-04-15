import express from "express";
import {
  getClients,
  addClient,
  updateClient,
  deleteClient,
} from "../controllers/clientsController.js";

const router = express.Router();

router.get("/", getClients); // GET all
router.post("/", addClient); // ADD new
router.put("/:id", updateClient); // UPDATE
router.delete("/:id", deleteClient); // DELETE

export default router;
