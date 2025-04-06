import { Request, Response } from "express";
import FileUtils from "../utils/FileUtils";
import { LoginData, User, Users, UserType } from "../types/UserTypes";

// 获取用户信息
export const getUserByQuery = async (req: Request, res: Response) => {
  try {
    const users: Users = await FileUtils.readJson(FileUtils.PATH_USERS);

    switch (req.query.mode) {
      case "find":
        const userEmail = req.query.email;
        const userHardware = req.query.hardware;
        if (userEmail) {
          const user: User = Object.values(users).find((user) => user.email === userEmail);
          if (user) {
            res.json({
              id: user.id,
              type: user.type,
              name: user.name,
              hardware: user.hardware,
              disability: user.disability || []
            });
          } else {
            res.status(404).json({ message: "User not found" });
          }
        } else if (userHardware) {
          const user: User = Object.values(users).find((user) => user.hardware === userHardware);
          if (user) {
            res.json({
              id: user.id,
              type: user.type,
              name: user.name,
              hardware: user.hardware,
              disability: user.disability || []
            });
          } else {
            res.status(404).json({ message: "User not found" });
          }
        } else {
          res.status(400).json({ error: "Parameter error" });
        }
        break;

      case "list":
        res.json(Object.entries(users).map(([id, user]) => ({
          id: user.id,
          type: user.type,
          name: user.name
        })));
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const users: Users = await FileUtils.readJson(FileUtils.PATH_USERS);

    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid ID format" }); // 校验非法数字
      return;
    }

    if (users[userId]) {
      res.json(users[userId]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 创建用户
export const createUser = async (req: Request, res: Response) => {
  try {
    const users: Users = await FileUtils.readJson(FileUtils.PATH_USERS);

    const user: User = req.body;

    if (user.type === UserType.ADMIN) {
      res.status(403).json({ error: "Permission missing" });
      return;
    }

    if (user.password.length !== 32) {
      res.status(400).json({ error: "Invalid password format" });
      return;
    }

    // 获取所有用户的ID并找到最大值
    const userIds = Object.keys(users).map(Number);
    const newId = userIds.length > 0 ? Math.max(...userIds) + 1 : 0;

    users[newId] = user;
    await FileUtils.writeJson(FileUtils.PATH_USERS, users);

    console.info(`User ${newId} created successfully`)
    res.status(201).json({ message: "User created successfully", id: newId, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 用户登录
export const login = async (req: Request, res: Response) => {
  try {
    const users: Users = await FileUtils.readJson(FileUtils.PATH_USERS);

    const data: LoginData = req.body;

    const email = data.email;
    const password = data.password;

    if (email && password) {
      const user: User = Object.values(users).find((user) => user.email === email);
      if (user && user.password === password) {
        res.json({
          id: user.id,
          type: user.type,
          name: user.name,
          email: user.email,
          hardware: user.hardware,
          disability: user.disability || [],
          tag: user.tag || []
        });
      } else {
        res.status(401).json({ error: "Incorrect email or password" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};