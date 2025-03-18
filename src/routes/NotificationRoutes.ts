import express from "express";
import {
  addNotification,
  clearNotification,
  getHelps,
  getNotification,
} from "../controllers/NotificationController";

const router = express.Router();

router.get("/notification/:email", getNotification);
router.get("/helps", getHelps);
router.get("/helps/:email", getHelps);
router.post("/notification/:email", addNotification);
router.delete("/notification/:email", clearNotification);

export default router;
