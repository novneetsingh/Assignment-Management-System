import express from "express";
import cors from "cors";
import "dotenv/config";
import prisma from "./config/prisma";

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
