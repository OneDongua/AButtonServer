import express from "express";
import { getMessage, sendMessage } from "../controllers/ChatController";

const router = express.Router();

router.get('/chat/:id', getMessage);
router.post('/chat/:id', sendMessage);

export default router;