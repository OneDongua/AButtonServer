import express from "express";
import { addNotification, clearNotification, getNotification,  } from "../controllers/NotificationController";

const router = express.Router();

router.get("/notification/:email", getNotification);
router.post("/notification/:email", addNotification);
router.delete("/notification/:email", clearNotification);

export default router;