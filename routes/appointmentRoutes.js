import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByUser,
  getMyAppointment,
} from "../controllers/appointmentController.js";
import { checkAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", protect, checkAdmin, getAllAppointments);
router.get("/my-appointments", protect, getMyAppointment);
router.get("/:id", getAppointmentById);
router.put("/:id", protect, updateAppointment);
router.delete("/:id", checkAdmin, deleteAppointment);
router.get("/user/:mobileNumber", getAppointmentsByUser);

export default router;
