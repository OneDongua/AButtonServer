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
        return;
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
      return;
    }
    const postPath = path.join(FileUtils.PATH_POSTS_FOLDER, time.toString());
    const detail: Detail = await FileUtils.readJson(path.join(postPath, "detail.json"));
    res.status(200).json(detail);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostImage = async (req: Request, res: Response) => {
  try {
    const time = Number(req.params.time);
    const index = Number(req.params.index);

    if (isNaN(time) || isNaN(index)) {
      res.status(400).json({ error: "Invalid time format" }); // 校验非法数字
      return;
    }
    const postPath = path.join(FileUtils.PATH_POSTS_FOLDER, time.toString());
    const imagesPath = path.join(postPath, "images");

    // 定义常见的图片文件后缀
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    let imagePath: string | null = null;

    for (const ext of imageExtensions) {
      const candidatePath = path.join(imagesPath, `${index}${ext}`);
      if (await FileUtils.exists(candidatePath)) {
        imagePath = candidatePath;
        break;
      }
    }

    if (!imagePath) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    res.sendFile(path.resolve(imagePath));
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
      disability: newPost.disability,
      comment: [],
      image_count: newPost.image_count,
      location: newPost.location
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
    if (isNaN(Number(time))) {
      res.status(400).json({ error: "Invalid time format" })
    }

    const posts: Posts = await FileUtils.readJson(FileUtils.PATH_POSTS);
    if (!posts.hasOwnProperty(time)) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    delete posts[Number(time)];
    await FileUtils.writeJson(FileUtils.PATH_POSTS, posts);
    
    await FileUtils.delete(path.join(FileUtils.PATH_POSTS_FOLDER, time))
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}