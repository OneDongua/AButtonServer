import express from "express";
import { getChats, getMessage, sendMessage } from "../controllers/ChatController";

const router = express.Router();

router.get('/chat/:id', getMessage);
router.post('/chat/:id', sendMessage);
router.get('/chat/list/:id', getChats);

export default router;