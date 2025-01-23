import express from "express";
import { createUser, getUserById, getUserByQuery } from "../controllers/UserController";

const router = express.Router();

router.get("/user", getUserByQuery);
router.get("/user/:id", getUserById);
router.post("/user", createUser);

export default router;