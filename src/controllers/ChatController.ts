import { Request, Response } from "express";
import FileUtils from "../utils/FileUtils";
import path from "path";
import { Message } from "../types/ChatTypes";

export const getMessage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const chat: Message[] = await FileUtils.readJson(path.join(FileUtils.PATH_CHATS_FOLDER, id + ".json"))
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newMessage: Message = req.body;

    if (!newMessage.user || !newMessage.message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    newMessage.time = Date.now();

    const chat: Message[] = await FileUtils.readJson(path.join(FileUtils.PATH_CHATS_FOLDER, id + ".json"))
    chat.push(newMessage);

    await FileUtils.writeJson(path.join(FileUtils.PATH_CHATS_FOLDER, id + ".json"), chat)
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};