import { Router } from "express";
import {
  submitAssignment,
  confirmSubmission,
  getAllSubmissions,
  getSubmissionsByAssignment,
  getMyGroupSubmissions,
} from "../controllers/submission.controller.js";
import { auth } from "../middlewares/auth.js";

const submissionRoutes = Router();

submissionRoutes.post("/", auth, submitAssignment);
submissionRoutes.patch("/:id/confirm", auth, confirmSubmission);
submissionRoutes.get("/", auth, getAllSubmissions);
submissionRoutes.get("/my-submissions", auth, getMyGroupSubmissions);
submissionRoutes.get(
  "/assignment/:assignmentId",
  auth,
  getSubmissionsByAssignment
);

export default submissionRoutes;
