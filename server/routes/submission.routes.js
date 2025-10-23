import { Router } from "express";
import {
  submitAssignment,
  confirmSubmission,
  getAllSubmissionsByAssignmentId,
} from "../controllers/submission.controller.js";
import { auth, isProfessor, isStudent } from "../middlewares/auth.js";

const submissionRoutes = Router();

// /submissions
submissionRoutes.post("/", auth, isStudent, submitAssignment);

// /submissions/confirm
submissionRoutes.patch("/confirm", auth, isProfessor, confirmSubmission);

// /submissions/:assignmentId
submissionRoutes.get(
  "/:assignmentId",
  auth,
  isProfessor,
  getAllSubmissionsByAssignmentId
);

export default submissionRoutes;
