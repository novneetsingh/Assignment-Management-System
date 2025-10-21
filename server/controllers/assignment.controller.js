import prisma from "../config/prisma.js";
import ErrorResponse from "../utils/errorResponse.js";

// Create assignment (Professor only)
export const createAssignment = async (req, res) => {
  const { title, description, dueDate, oneDriveLink } = req.body;

  if (!title || !description || !dueDate || !oneDriveLink) {
    throw new ErrorResponse("Please provide all fields", 400);
  }

  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      oneDriveLink,
      creatorId: req.user.id,
    },
  });

  res.status(201).json({
    success: true,
    message: "Assignment created successfully",
    data: assignment,
  });
};

// Get all assignments
export const getAllAssignments = async (req, res) => {
  const assignments = await prisma.assignment.findMany({
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      submissions: {
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: assignments,
  });
};

// Get single assignment
export const getAssignment = async (req, res) => {
  const { id } = req.params;

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      submissions: {
        include: {
          group: {
            select: {
              id: true,
              name: true,
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!assignment) {
    throw new ErrorResponse("Assignment not found", 404);
  }

  res.status(200).json({
    success: true,
    data: assignment,
  });
};

// Update assignment (Professor only)
export const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, oneDriveLink } = req.body;

  const assignment = await prisma.assignment.findUnique({
    where: { id },
  });

  if (!assignment) {
    throw new ErrorResponse("Assignment not found", 404);
  }

  if (assignment.creatorId !== req.user.id) {
    throw new ErrorResponse(
      "You are not authorized to update this assignment",
      403
    );
  }

  const updatedAssignment = await prisma.assignment.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
      ...(oneDriveLink && { oneDriveLink }),
    },
  });

  res.status(200).json({
    success: true,
    message: "Assignment updated successfully",
    data: updatedAssignment,
  });
};

// Delete assignment (Professor only)
export const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  const assignment = await prisma.assignment.findUnique({
    where: { id },
  });

  if (!assignment) {
    throw new ErrorResponse("Assignment not found", 404);
  }

  if (assignment.creatorId !== req.user.id) {
    throw new ErrorResponse(
      "You are not authorized to delete this assignment",
      403
    );
  }

  await prisma.assignment.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: "Assignment deleted successfully",
  });
};

// Get assignment analytics (Professor only)
export const getAssignmentAnalytics = async (req, res) => {
  const totalAssignments = await prisma.assignment.count();

  const totalGroups = await prisma.group.count();

  const totalSubmissions = await prisma.submission.count();

  const confirmedSubmissions = await prisma.submission.count({
    where: {
      isConfirmed: true,
    },
  });

  const assignments = await prisma.assignment.findMany({
    include: {
      submissions: {
        include: {
          group: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const assignmentStats = assignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    totalSubmissions: assignment.submissions.length,
    confirmedSubmissions: assignment.submissions.filter((s) => s.isConfirmed)
      .length,
  }));

  res.status(200).json({
    success: true,
    data: {
      totalAssignments,
      totalGroups,
      totalSubmissions,
      confirmedSubmissions,
      assignmentStats,
    },
  });
};
