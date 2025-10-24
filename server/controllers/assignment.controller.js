import prisma from "../config/prisma.js";
import ErrorResponse from "../utils/errorResponse.js";

// Create assignment
export const createAssignment = async (req, res) => {
  const { title, description, dueDate, oneDriveLink } = req.body;

  if (!title || !description || !dueDate || !oneDriveLink)
    throw new ErrorResponse("Please provide all fields", 400);

  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate + "T00:00:00.000Z"),
      oneDriveLink,
      creatorId: req.user.id,
    },
  });

  res.status(201).json({
    success: assignment ? true : false,
    message: assignment
      ? "Assignment created successfully"
      : "Assignment not created",
    data: assignment ? assignment : null,
  });
};

// Get all assignments
export const getAllAssignments = async (req, res) => {
  const assignments = await prisma.assignment.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  //check if assignments are already submitted by current user
  const submissions = await prisma.submission.findMany({
    where: {
      assignmentId: {
        in: assignments.map((assignment) => assignment.id),
      },
      userId: req.user.id,
    },
  });

  assignments.forEach((assignment) => {
    assignment.isSubmitted = submissions.some(
      (submission) => submission.assignmentId === assignment.id
    );
  });

  res.status(200).json({
    success: assignments ? true : false,
    message: assignments
      ? "Assignments fetched successfully"
      : "Assignments not fetched",
    count: assignments ? assignments.length : 0,
    data: assignments ? assignments : [],
  });
};

// get all assignments by professor id
export const getAssignmentsByProfessor = async (req, res) => {
  const assignments = await prisma.assignment.findMany({
    where: {
      creatorId: req.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.status(200).json({
    success: assignments ? true : false,
    message: assignments
      ? "Assignments fetched successfully"
      : "Assignments not fetched",
    count: assignments ? assignments.length : 0,
    data: assignments ? assignments : [],
  });
};

// Get single assignment
export const getAssignment = async (req, res) => {
  const { assignmentId } = req.params;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  //check if assignment is already submitted by current user
  const submission = await prisma.submission.findFirst({
    where: { assignmentId: assignmentId, userId: req.user.id },
  });

  assignment.isSubmitted = submission ? true : false;

  res.status(200).json({
    success: assignment ? true : false,
    message: assignment
      ? "Assignment fetched successfully"
      : "Assignment not fetched",
    data: assignment ? assignment : null,
  });
};

// Update assignment
export const updateAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { title, description, dueDate, oneDriveLink } = req.body;

  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, creatorId: req.user.id },
  });

  if (!assignment)
    throw new ErrorResponse(
      "Assignment not found or you are not authorized",
      404
    );

  const updatedAssignment = await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(dueDate && { dueDate: new Date(dueDate + "T00:00:00.000Z") }),
      ...(oneDriveLink && { oneDriveLink }),
    },
  });

  res.status(200).json({
    success: updatedAssignment ? true : false,
    message: updatedAssignment
      ? "Assignment updated successfully"
      : "Assignment not updated",
    data: updatedAssignment ? updatedAssignment : null,
  });
};

// Get assignment analytics
export const getAssignmentAnalytics = async (req, res) => {
  const professorId = req.user.id;

  // get all assignments created by professor
  const assignments = await prisma.assignment.findMany({
    where: {
      creatorId: professorId,
    },
  });

  // get all submissions where assignmentId is in assignments
  const submissions = await prisma.submission.findMany({
    where: {
      assignmentId: {
        in: assignments.map((assignment) => assignment.id),
      },
    },
  });

  const totalSubmissions = submissions.length;

  const confirmedSubmissions = submissions.filter(
    (submission) => submission.status === "Confirmed"
  ).length;

  const groupSubmissions = submissions.filter(
    (submission) => submission.groupId
  ).length;

  res.status(200).json({
    success: true,
    message: "Assignment analytics fetched successfully",
    data: {
      totalAssignments: assignments.length,
      totalSubmissions,
      confirmedSubmissions,
      pendingSubmissions: totalSubmissions - confirmedSubmissions,
      groupSubmissions,
      individualSubmissions: totalSubmissions - groupSubmissions,
      percentageConfirmed: (confirmedSubmissions / totalSubmissions) * 100,
    },
  });
};
