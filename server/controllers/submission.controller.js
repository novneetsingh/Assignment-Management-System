import prisma from "../config/prisma.js";
import ErrorResponse from "../utils/errorResponse.js";

// Submit assignment (initial submission)
export const submitAssignment = async (req, res) => {
  const { assignmentId, groupId } = req.body;

  if (!assignmentId || !groupId) {
    throw new ErrorResponse("Please provide assignment ID and group ID", 400);
  }

  // Check if assignment exists
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    throw new ErrorResponse("Assignment not found", 404);
  }

  // Check if group exists and user is a member
  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      members: {
        some: {
          userId: req.user.id,
        },
      },
    },
  });

  if (!group) {
    throw new ErrorResponse("Group not found or you are not a member", 404);
  }

  // Check if submission already exists
  const existingSubmission = await prisma.submission.findUnique({
    where: {
      assignmentId_groupId: {
        assignmentId,
        groupId,
      },
    },
  });

  if (existingSubmission) {
    throw new ErrorResponse("Submission already exists for this group", 400);
  }

  const submission = await prisma.submission.create({
    data: {
      assignmentId,
      groupId,
      userId: req.user.id,
      isConfirmed: false,
    },
  });

  res.status(201).json({
    success: true,
    message: "Assignment submitted successfully. Please confirm submission.",
    data: submission,
  });
};

// Confirm submission (two-step verification)
export const confirmSubmission = async (req, res) => {
  const { id } = req.params;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      group: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!submission) {
    throw new ErrorResponse("Submission not found", 404);
  }

  // Check if user is a member of the group
  const isMember = submission.group.members.some((m) => m.userId === req.user.id);
  if (!isMember) {
    throw new ErrorResponse("You are not a member of this group", 403);
  }

  if (submission.isConfirmed) {
    throw new ErrorResponse("Submission already confirmed", 400);
  }

  const updatedSubmission = await prisma.submission.update({
    where: { id },
    data: {
      isConfirmed: true,
    },
  });

  res.status(200).json({
    success: true,
    message: "Submission confirmed successfully",
    data: updatedSubmission,
  });
};

// Get all submissions
export const getAllSubmissions = async (req, res) => {
  const submissions = await prisma.submission.findMany({
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          dueDate: true,
        },
      },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: submissions,
  });
};

// Get submissions for a specific assignment
export const getSubmissionsByAssignment = async (req, res) => {
  const { assignmentId } = req.params;

  const submissions = await prisma.submission.findMany({
    where: {
      assignmentId,
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: submissions,
  });
};

// Get submissions for user's groups
export const getMyGroupSubmissions = async (req, res) => {
  const userGroups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: req.user.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  const groupIds = userGroups.map((g) => g.id);

  const submissions = await prisma.submission.findMany({
    where: {
      groupId: {
        in: groupIds,
      },
    },
    include: {
      assignment: {
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          oneDriveLink: true,
        },
      },
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: submissions,
  });
};
