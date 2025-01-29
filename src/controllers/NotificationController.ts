import { Request, Response } from "express";
import { NewNotification, NotificationsData } from "../types/NotificationTypes";
import FileUtils from "../utils/FileUtils";

export const getNotification = async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const data: NotificationsData = await FileUtils.readJson(FileUtils.PATH_NOTIFICATIONS);
    const notifications = data[email] || { count: 0, notifications: [] };
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addNotification = async (req: Request, res: Response) => {
  const email = req.params.email;
  const newNotification: NewNotification = req.body;
  try {
    const data: NotificationsData = await FileUtils.readJson(FileUtils.PATH_NOTIFICATIONS);
    if (data[email]) {
      data[email].count++;
      data[email].notifications.push(newNotification.notification);
    } else {
      data[email] = { count: 1, notifications: [newNotification.notification] };
    }
    await FileUtils.writeJson(FileUtils.PATH_NOTIFICATIONS, data);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const clearNotification = async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const data: NotificationsData = await FileUtils.readJson(FileUtils.PATH_NOTIFICATIONS);
    if (data[email]) {
      data[email].count = 0;
      data[email].notifications = [];
      await FileUtils.writeJson(FileUtils.PATH_NOTIFICATIONS, data);
    }
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}