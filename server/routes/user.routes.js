import { Router } from "express";
import { getMe, getAllStudents } from "../controllers/user.controller.js";
import { auth, isStudent } from "../middlewares/auth.js";

const userRoutes = Router();

// /users/me
userRoutes.get("/me", auth, getMe);

// /users/students
userRoutes.get("/students", auth, isStudent, getAllStudents);

export default userRoutes;
