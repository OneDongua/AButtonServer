import { Request, Response } from "express";
import { Notification, NotificationData, NotificationsList } from "../types/NotificationTypes";
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

export const getGlobalNotification = async (req: Request, res: Response) => {
  try {
    const notifications: NotificationData = await FileUtils.readJson(FileUtils.PATH_GLOBAL_NOTIFICATIONS);
    res.status(200).json(notifications);
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
    if (newNotification.location) {
      handleAddGlobalNotification(newNotification)
    }
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addGlobalNotification = async (req: Request, res: Response) => {
  try {
    const newNotification: Notification = req.body;
    handleAddGlobalNotification(newNotification)
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleAddGlobalNotification = async (newNotification: Notification) => {
  if (!newNotification.time) newNotification.time = Date.now();
  let notifications: NotificationData = await FileUtils.readJson(FileUtils.PATH_GLOBAL_NOTIFICATIONS)
  if (notifications.count) {
    notifications.count++
    notifications.notifications.push(newNotification)
  } else {
    notifications = { count: 1, notifications: [newNotification] }
  }
  await FileUtils.writeJson(FileUtils.PATH_GLOBAL_NOTIFICATIONS, notifications);
}

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const time = req.params.time;
    if (isNaN(Number(time))) {
      res.status(400).json({ error: "Invalid time format" })
    }

    const data: NotificationsList = await FileUtils.readJson(FileUtils.PATH_NOTIFICATIONS);
    if (data[email]) {
      const notifications: NotificationData = data[email];
      if (notifications.count > 0) {
        const index = notifications.notifications.findIndex(n => n.time === Number(time));
        if (index !== -1) {
          notifications.notifications.splice(index, 1);
          notifications.count--;
          await FileUtils.writeJson(FileUtils.PATH_NOTIFICATIONS, data);
          res.status(200).json({ message: "Success" });
          return;
        }
      }
      res.status(404).json({ error: "Notification not found" });
    } else {
      res.status(404).json({ error: "User not found" });
    }

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const deleteGlobalNotification = async (req: Request, res: Response) => {
  try {
    const time = req.params.time;
    if (isNaN(Number(time))) {
      res.status(400).json({ error: "Invalid time format" })
    }
    const notifications: NotificationData = await FileUtils.readJson(FileUtils.PATH_GLOBAL_NOTIFICATIONS);
    if (notifications.count > 0) {
      const index = notifications.notifications.findIndex(n => n.time === Number(time));
      if (index !== -1) {
        notifications.notifications.splice(index, 1);
        notifications.count--;
        await FileUtils.writeJson(FileUtils.PATH_GLOBAL_NOTIFICATIONS, notifications);
        res.status(200).json({ message: "Success" });
        return;
      }
    }
    res.status(404).json({ error: "Notification not found" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

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
}

export const clearGlobalNotification = async (req: Request, res: Response) => {
  try {
    const notifications: NotificationData = await FileUtils.readJson(FileUtils.PATH_GLOBAL_NOTIFICATIONS);
    notifications.count = 0;
    notifications.notifications = [];
    await FileUtils.writeJson(FileUtils.PATH_GLOBAL_NOTIFICATIONS, notifications);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}