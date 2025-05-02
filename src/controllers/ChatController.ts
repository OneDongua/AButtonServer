import { Request, Response } from "express";
import FileUtils from "../utils/FileUtils";
import path from "path";
import { ChatList, Message } from "../types/ChatTypes";
import { Users } from "../types/UserTypes";

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

    if (!newMessage.id || !newMessage.message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (isNaN(Number(id))) {
      res.status(400).json({ error: "Invalid ID format" }); // 校验非法数字
      return;
    }
    if (isNaN(Number(newMessage.id))) {
      res.status(400).json({ error: "Invalid user ID format" }); // 校验非法数字
      return;
    }

    const chatId = Number(id);
    const userId = newMessage.id;

    if (!newMessage.name) {
      const users: Users = await FileUtils.readJson(FileUtils.PATH_USERS);

      if (users[userId]) {
        newMessage.name = users[userId].name;
      } else {
        newMessage.name = "未知";
      }
    }
    newMessage.time = Date.now();

    const chat: Message[] = await FileUtils.readJson(path.join(FileUtils.PATH_CHATS_FOLDER, chatId + ".json"), "[]");
    chat.push(newMessage);

    const chats: ChatList = await FileUtils.readJson(FileUtils.PATH_CHATS);
    if (chats[userId]) {
      if (!chats[userId].includes(chatId))
        chats[userId].push(chatId);
    } else {
      chats[userId] = [chatId];
    }
    await FileUtils.writeJson(FileUtils.PATH_CHATS, chats)

    await FileUtils.writeJson(path.join(FileUtils.PATH_CHATS_FOLDER, chatId + ".json"), chat)
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const chats: ChatList = await FileUtils.readJson(FileUtils.PATH_CHATS);
    if (chats[userId]) {
      res.status(200).json(chats[userId]);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
