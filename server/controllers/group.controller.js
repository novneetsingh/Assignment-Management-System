import prisma from "../config/prisma.js";
import ErrorResponse from "../utils/errorResponse.js";

// Create group
export const createGroup = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ErrorResponse("Please provide group name", 400);
  }

  const group = await prisma.group.create({
    data: {
      name,
      creatorId: req.user.id,
      members: {
        create: {
          userId: req.user.id,
        },
      },
    },
    include: {
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
  });

  res.status(201).json({
    success: true,
    message: "Group created successfully",
    data: group,
  });
};

// Get all groups
export const getAllGroups = async (req, res) => {
  const groups = await prisma.group.findMany({
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      submissions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: true,
    data: groups,
  });
};

// Get user's groups
export const getMyGroups = async (req, res) => {
  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: req.user.id,
        },
      },
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      submissions: {
        include: {
          assignment: {
            select: {
              id: true,
              title: true,
              dueDate: true,
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
    data: groups,
  });
};

// Get single group
export const getGroup = async (req, res) => {
  const { id } = req.params;

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      submissions: {
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
        },
      },
    },
  });

  if (!group) {
    throw new ErrorResponse("Group not found", 404);
  }

  res.status(200).json({
    success: true,
    data: group,
  });
};

// Add member to group
export const addMemberToGroup = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    throw new ErrorResponse("Please provide member email", 400);
  }

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      members: true,
    },
  });

  if (!group) {
    throw new ErrorResponse("Group not found", 404);
  }

  // Check if user is group creator
  if (group.creatorId !== req.user.id) {
    throw new ErrorResponse("Only group creator can add members", 403);
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }

  if (user.accountType !== "Student") {
    throw new ErrorResponse("Only students can be added to groups", 400);
  }

  // Check if user is already a member
  const existingMember = group.members.find((m) => m.userId === user.id);
  if (existingMember) {
    throw new ErrorResponse("User is already a member of this group", 400);
  }

  // Add member
  await prisma.groupMember.create({
    data: {
      groupId: id,
      userId: user.id,
    },
  });

  const updatedGroup = await prisma.group.findUnique({
    where: { id },
    include: {
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
  });

  res.status(200).json({
    success: true,
    message: "Member added successfully",
    data: updatedGroup,
  });
};

// Remove member from group
export const removeMemberFromGroup = async (req, res) => {
  const { id, memberId } = req.params;

  const group = await prisma.group.findUnique({
    where: { id },
  });

  if (!group) {
    throw new ErrorResponse("Group not found", 404);
  }

  // Check if user is group creator
  if (group.creatorId !== req.user.id) {
    throw new ErrorResponse("Only group creator can remove members", 403);
  }

  // Don't allow removing the creator
  if (memberId === group.creatorId) {
    throw new ErrorResponse("Cannot remove group creator", 400);
  }

  await prisma.groupMember.deleteMany({
    where: {
      groupId: id,
      userId: memberId,
    },
  });

  res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
};

// Delete group
export const deleteGroup = async (req, res) => {
  const { id } = req.params;

  const group = await prisma.group.findUnique({
    where: { id },
  });

  if (!group) {
    throw new ErrorResponse("Group not found", 404);
  }

  if (group.creatorId !== req.user.id) {
    throw new ErrorResponse("Only group creator can delete the group", 403);
  }

  await prisma.group.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: "Group deleted successfully",
  });
};
