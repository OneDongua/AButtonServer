import { Request, Response } from "express";
import { Notification, NotificationsList } from "../types/NotificationTypes";
import FileUtils from "../utils/FileUtils";

export const getNotification = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const data: NotificationsList = await FileUtils.readJson(FileUtils.PATH_NOTIFICATIONS);
    const notifications = data[email] || { count: 0, notifications: [] };
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addNotification = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const newNotification: Notification = req.body.notification;
    if (!newNotification.time) newNotification.time = Date.now();
    const data: NotificationsList = await FileUtils.readJson(FileUtils.PATH_NOTIFICATIONS);
    if (data[email]) {
      data[email].count++;
      data[email].notifications.push(newNotification);
    } else {
      data[email] = { count: 1, notifications: [newNotification] };
    }
    await FileUtils.writeJson(FileUtils.PATH_NOTIFICATIONS, data);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const clearNotification = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const data: NotificationsList = await FileUtils.readJson(FileUtils.PATH_NOTIFICATIONS);
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