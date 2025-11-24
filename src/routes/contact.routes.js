import { Router } from "express";
import { sendContactMessage } from "../controllers/contact.controller.js";

const router = Router();

// POST /api/v1/contact
router.route("/").post(sendContactMessage);

export default router;
