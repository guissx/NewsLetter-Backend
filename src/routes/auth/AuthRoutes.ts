import express from "express";
import { loginUser } from "../../controllers/auth/auth.controller"

const router = express.Router();

router.post("/login", loginUser);

export default router;