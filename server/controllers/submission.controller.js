import prisma from "../config/prisma.js";
import ErrorResponse from "../utils/errorResponse.js";

// Submit assignment by group or individual
export const submitAssignment = async (req, res) => {
  const { assignmentId, groupId } = req.body;
  const userId = req.user.id;

  // Check if assignment exists
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) throw new ErrorResponse("Assignment not found", 404);

  // Check if group exists and user is a member
  if (groupId) {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            userId,
          },
        },
      },
    });

    if (!group)
      throw new ErrorResponse("Group not found or you are not a member", 404);

    const existingSubmission = await prisma.submission.findFirst({
      where: {
        assignmentId,
        groupId,
      },
    });

    if (existingSubmission)
      throw new ErrorResponse("Submission already exists for this group", 400);
  } else {
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        assignmentId,
        userId,
      },
    });

    if (existingSubmission)
      throw new ErrorResponse(
        "Submission already exists for this assignment by you",
        400
      );
  }

  const submission = await prisma.submission.create({
    data: {
      assignmentId,
      groupId,
      userId,
    },
  });

  res.status(201).json({
    success: submission ? true : false,
    message: submission
      ? "Assignment submitted successfully."
      : "Assignment not submitted.",
    data: submission ? submission : null,
  });
};

// Confirm submission by professor
export const confirmSubmission = async (req, res) => {
  const { submissionId, assignmentId } = req.body;

  // Check if assignment exists and creator is current user
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, creatorId: req.user.id },
  });

  if (!assignment)
    throw new ErrorResponse(
      "Assignment not found or you are not authorized",
      404
    );

  const updatedSubmission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "Confirmed",
    },
  });

  res.status(200).json({
    success: updatedSubmission ? true : false,
    message: updatedSubmission
      ? "Submission confirmed successfully."
      : "Submission not confirmed.",
    data: updatedSubmission ? updatedSubmission : null,
  });
};

// Get all submissions by assignment id
export const getAllSubmissionsByAssignmentId = async (req, res) => {
  // check if the assignment belongs to the current user
  const assignment = await prisma.assignment.findFirst({
    where: { id: req.params.assignmentId, creatorId: req.user.id },
  });

  if (!assignment)
    throw new ErrorResponse(
      "Assignment not found or you are not authorized",
      404
    );

  const submissions = await prisma.submission.findMany({
    where: { assignmentId: req.params.assignmentId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      group: true,
    },
  });

  res.status(200).json({
    success: submissions ? true : false,
    message: submissions
      ? "Submissions fetched successfully."
      : "Submissions not fetched.",
    count: submissions ? submissions.length : 0,
    data: submissions ? submissions : null,
  });
};
