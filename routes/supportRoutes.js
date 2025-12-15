import express from "express";
import {
  createSupportRequest,
  getAllSupportRequests,
  updateSupportRequest,
  deleteSupportRequest,
} from "../controllers/supportController.js";

const router = express.Router();

router.post("/contact-us", createSupportRequest);
router.get("/", getAllSupportRequests);
router.put("/:id", updateSupportRequest);
router.delete("/:id", deleteSupportRequest);

export default router;
