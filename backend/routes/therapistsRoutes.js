import express from "express";
import { getTherapists, addTherapist, deleteTherapist, updateTherapist } from "../controllers/therapistsController.js"; // Controller Functionality

const router = express.Router();

// Route for getting all therapists
router.get("/", getTherapists);

// Route for adding a new therapist
router.post("/", addTherapist);

// Route for deleting a therapist by ID
router.delete("/:id", deleteTherapist);

// Route for updating a therapist by ID
router.put("/:id", updateTherapist);

export default router;
