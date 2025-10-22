import prisma from "../config/prisma.js";
import ErrorResponse from "../utils/errorResponse.js";

// Create group
export const createGroup = async (req, res) => {
  const { name, members } = req.body;

  if (!name || !Array.isArray(members) || members.length === 0)
    throw new ErrorResponse("Please provide group name and members", 400);

  const allMembers = [...new Set([...members, req.user.id])];

  const group = await prisma.group.create({
    data: {
      name,
      creatorId: req.user.id,
      members: {
        create: allMembers.map((member) => ({
          userId: member,
        })),
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  res.status(201).json({
    success: group ? true : false,
    message: group ? "Group created successfully" : "Group not created",
    data: group ? group : null,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: groups ? true : false,
    message: groups ? "Groups fetched successfully" : "Groups not found",
    count: groups ? groups.length : 0,
    data: groups ? groups : null,
  });
};

// Get single group
export const getGroup = async (req, res) => {
  const { groupId } = req.params;

  const group = await prisma.group.findUnique({
    where: { id: groupId, members: { some: { userId: req.user.id } } },
    include: {
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    success: group ? true : false,
    message: group ? "Group fetched successfully" : "Group not found",
    data: group ? group : null,
  });
};

// Add member to group
export const addMemberToGroup = async (req, res) => {
  const { groupId, userId } = req.params;

  const group = await prisma.group.findFirst({
    where: { id: groupId, creatorId: req.user.id },
    include: {
      members: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!group)
    throw new ErrorResponse("Group not found or you are not the creator", 404);

  const existingMember = group.members.find(
    (member) => member.userId === userId
  );

  if (existingMember)
    throw new ErrorResponse("User is already a member of this group", 400);

  const updatedGroup = await prisma.group.update({
    where: { id: groupId },
    data: {
      members: {
        create: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
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
