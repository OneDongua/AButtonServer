import express from "express";
import { createUser, getUserById, getUserByQuery, login } from "../controllers/UserController";

const router = express.Router();

router.get("/user", getUserByQuery);
router.get("/user/:id", getUserById);
router.post("/user", createUser);
router.post("/login", login);

export default router;