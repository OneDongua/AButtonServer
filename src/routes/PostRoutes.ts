import express from "express";
import { getPost, getPostDetail, addPost, deletePost } from "../controllers/PostController";

const router = express.Router();

router.get('/post', getPost);
router.get('/post/:time', getPost);
router.get('/post/:time/detail', getPostDetail);
router.post('/post', addPost);
router.delete('/post/:time', deletePost);

export default router;