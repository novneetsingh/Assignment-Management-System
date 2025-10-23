import { Router } from "express";
import {
  createAssignment,
  getAllAssignments,
  getAssignment,
  updateAssignment,
  getAssignmentAnalytics,
  getAssignmentsByProfessor,
} from "../controllers/assignment.controller.js";
import { auth, isProfessor, isStudent } from "../middlewares/auth.js";

const assignmentRoutes = Router();

// /assignments/
assignmentRoutes.post("/", auth, isProfessor, createAssignment);

// /assignments/:assignmentId
assignmentRoutes.put("/:assignmentId", auth, isProfessor, updateAssignment);

// /assignments/analytics
assignmentRoutes.get("/analytics", auth, isProfessor, getAssignmentAnalytics);

// /assignments
assignmentRoutes.get("/", auth, isStudent, getAllAssignments);

// /assignments/professor
assignmentRoutes.get(
  "/professor",
  auth,
  isProfessor,
  getAssignmentsByProfessor
);

// /assignments/:assignmentId
assignmentRoutes.get("/:assignmentId", auth, getAssignment);

export default assignmentRoutes;
