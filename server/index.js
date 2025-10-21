import express from "express";
import cors from "cors";
import "dotenv/config";
import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import groupRoutes from "./routes/group.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());

// Test database connection
(async () => {
  try {
    await prisma.$connect();
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
})();

app.get("/", (req, res) => {
  res.send("Assignment Management System API");
});

// main routes
app.use("/auth", authRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/groups", groupRoutes);
app.use("/submissions", submissionRoutes);
app.use("/users", userRoutes);

// global error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err || "Internal Server Error",
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
