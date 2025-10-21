import prisma from "../config/prisma.js";
import ErrorResponse from "../utils/errorResponse.js";

// Get current user profile
export const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      accountType: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// Get all students (for adding to groups)
export const getAllStudents = async (req, res) => {
  const students = await prisma.user.findMany({
    where: {
      accountType: "Student",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.status(200).json({
    success: true,
    data: students,
  });
};
