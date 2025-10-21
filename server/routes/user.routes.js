import { Router } from "express";
import { getMe, getAllStudents } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";

const userRoutes = Router();

userRoutes.get("/me", auth, getMe);
userRoutes.get("/students", auth, getAllStudents);

export default userRoutes;
