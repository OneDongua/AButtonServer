import express from "express";
import { getPost, getPostDetail, addPost, deletePost, getPostImage } from "../controllers/PostController";

const router = express.Router();

router.get('/post', getPost);
router.get('/post/:time', getPost);
router.get('/post/:time/detail', getPostDetail);
router.get('/post/:time/image/:index', getPostImage);
router.post('/post', addPost);
router.delete('/post/:time', deletePost);

export default router;