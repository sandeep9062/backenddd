import express from "express";
import { getAllPatients } from "../controllers/patientController.js";

const router = express.Router();

// get all patients

router.get("/", getAllPatients);

export default router;
