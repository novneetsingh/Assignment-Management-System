import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const authRoutes = Router();

// /auth/register
authRoutes.post("/register", register);

// /auth/login
authRoutes.post("/login", login);

export default authRoutes;
