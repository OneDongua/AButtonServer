import { Request, Response } from "express";
import FileUtils from "../utils/FileUtils";
import path from "path";
import { Detail, NewPost, Posts } from "../types/PostTypes";

export const getPost = async (req: Request, res: Response) => {
  try {
    const param = req.params.time;
    const posts: Posts = await FileUtils.readJson(FileUtils.PATH_POSTS);
    if (param == null) {
      res.status(200).json(posts);
    } else {
      const time = Number(param);
      if (isNaN(time)) {
        res.status(400).json({ error: "Invalid time format" }); // 校验非法数字
      }
      res.status(200).json(posts[time]);
    }

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostDetail = async (req: Request, res: Response) => {
  try {
    const time = Number(req.params.time);
    if (isNaN(time)) {
      res.status(400).json({ error: "Invalid time format" }); // 校验非法数字
    }
    const postPath = path.join(FileUtils.PATH_POSTS_FOLDER, time.toString());
    const detail: Detail = await FileUtils.readJson(path.join(postPath, "detail.json"));
    res.status(200).json(detail);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addPost = async (req: Request, res: Response) => {
  try {
    const newPost: NewPost = req.body;
    const time = Date.now();
    const posts: Posts = await FileUtils.readJson(FileUtils.PATH_POSTS);
    posts[time] = {
      location: newPost.location,
      title: newPost.title,
      disability: newPost.disability,
      count: 1,
      mod_time: time
    }
    await FileUtils.writeJson(FileUtils.PATH_POSTS, posts);
    const newPath = path.join(FileUtils.PATH_POSTS_FOLDER, time.toString())
    await FileUtils.mkdirs(path.join(newPath, "images"))
    const detail: Detail = {
      author_id: newPost.author_id,
      title: newPost.title,
      content: newPost.content,
      comment: [],
      image_count: newPost.image_count
    }
    await FileUtils.writeJson(path.join(newPath, "detail.json"), detail)
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const time = req.params.time;
    await FileUtils.delete(path.join(FileUtils.PATH_POSTS_FOLDER, time))
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}