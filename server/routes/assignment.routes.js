import { Router } from "express";
import {
  createAssignment,
  getAllAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentAnalytics,
} from "../controllers/assignment.controller.js";
import { auth, isProfessor } from "../middlewares/auth.js";

const assignmentRoutes = Router();

// Professor only routes
assignmentRoutes.post("/", auth, isProfessor, createAssignment);
assignmentRoutes.put("/:id", auth, isProfessor, updateAssignment);
assignmentRoutes.delete("/:id", auth, isProfessor, deleteAssignment);
assignmentRoutes.get("/analytics", auth, isProfessor, getAssignmentAnalytics);

// All authenticated users
assignmentRoutes.get("/", auth, getAllAssignments);
assignmentRoutes.get("/:id", auth, getAssignment);

export default assignmentRoutes;
