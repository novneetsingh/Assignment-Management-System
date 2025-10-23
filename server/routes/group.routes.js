import { Router } from "express";
import {
  createGroup,
  getMyGroups,
  getGroup,
  addMemberToGroup,
} from "../controllers/group.controller.js";
import { auth, isStudent } from "../middlewares/auth.js";

const groupRoutes = Router();

// /groups
groupRoutes.post("/", auth, isStudent, createGroup);

// /groups/my-groups
groupRoutes.get("/my-groups", auth, isStudent, getMyGroups);

// /groups/:groupId
groupRoutes.get("/:groupId", auth, isStudent, getGroup);

// /groups/:groupId/members/:userId
groupRoutes.post(
  "/:groupId/members/:userId",
  auth,
  isStudent,
  addMemberToGroup
);

export default groupRoutes;
