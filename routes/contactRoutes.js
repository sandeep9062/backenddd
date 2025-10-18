import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

// ✅ Routes
router.post("/", createContact);        // Submit message with reCAPTCHA
router.get("/", getContacts);           // Get all messages
router.get("/:id", getContactById);     // Get single message
router.put("/:id", updateContactStatus);// Update message status (new, read, archived)
router.delete("/:id", deleteContact);   // Delete message

export default router;
