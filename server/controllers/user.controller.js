import prisma from "../config/prisma.js";

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
    },
  });

  res.status(200).json({
    success: user ? true : false,
    message: user ? "User found" : "User not found",
    data: user ? user : null,
  });
};

// Get all students
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
    success: students ? true : false,
    message: students ? "Students found" : "Students not found",
    data: students ? students : null,
  });
};
