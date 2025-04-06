import express from "express";
import { addNotification, clearGlobalNotification, clearNotification, deleteGlobalNotification, deleteNotification, getGlobalNotification, getNotification,  } from "../controllers/NotificationController";

const router = express.Router();

router.get("/notification/:email", getNotification);
router.get("/global/notification/", getGlobalNotification);
router.post("/notification/:email", addNotification);
router.delete("/notification/:email", clearNotification);
router.delete("/global/notification/", clearGlobalNotification);
router.delete("/notification/:email/:time", deleteNotification);
router.delete("/global/notification/:time", deleteGlobalNotification);

export default router;