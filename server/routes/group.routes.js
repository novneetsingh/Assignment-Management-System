import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getMyGroups,
  getGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  deleteGroup,
} from "../controllers/group.controller.js";
import { auth } from "../middlewares/auth.js";

const groupRoutes = Router();

groupRoutes.post("/", auth, createGroup);
groupRoutes.get("/", auth, getAllGroups);
groupRoutes.get("/my-groups", auth, getMyGroups);
groupRoutes.get("/:id", auth, getGroup);
groupRoutes.post("/:id/members", auth, addMemberToGroup);
groupRoutes.delete("/:id/members/:memberId", auth, removeMemberFromGroup);
groupRoutes.delete("/:id", auth, deleteGroup);

export default groupRoutes;
