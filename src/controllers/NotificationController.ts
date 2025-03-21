import { Request, Response } from "express";
import {
  Helps,
  Notification,
  NotificationData,
  NotificationsList,
} from "../types/NotificationTypes";
import FileUtils from "../utils/FileUtils";

export const getNotification = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const data: NotificationsList = await FileUtils.readJson(
      FileUtils.PATH_NOTIFICATIONS
    );
    const notifications = data[email] || { count: 0, notifications: [] };
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getHelps = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const data: Helps = await FileUtils.readJson(FileUtils.PATH_HELPS);
    if (email) {
      const notifications = data[email] || [];
      res.status(200).json(notifications);
      return;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addNotification = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const newNotification: Notification = req.body;
    if (!newNotification.time) newNotification.time = Date.now();
    const data: NotificationsList = await FileUtils.readJson(
      FileUtils.PATH_NOTIFICATIONS
    );
    if (data[email]) {
      data[email].count++;
      data[email].notifications.push(newNotification);
    } else {
      data[email] = { count: 1, notifications: [newNotification] };
    }
    if (newNotification.type === "help") {
      const helps: Helps = await FileUtils.readJson(FileUtils.PATH_HELPS);
      if (helps[email]) {
        helps[email].push(newNotification);
      } else {
        helps[email] = [newNotification];
      }
      await FileUtils.writeJson(FileUtils.PATH_HELPS, helps);
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
    const data: NotificationsList = await FileUtils.readJson(
      FileUtils.PATH_NOTIFICATIONS
    );
    if (data[email]) {
      data[email].count = 0;
      data[email].notifications = [];
      await FileUtils.writeJson(FileUtils.PATH_NOTIFICATIONS, data);
    }
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
