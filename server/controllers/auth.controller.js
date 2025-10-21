import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";

// register a user
export const register = async (req, res) => {
  const { name, email, password, accountType } = req.body;

  if (!name || !email || !password || !accountType)
    throw new ErrorResponse("Please provide all fields", 400);

  // check if user already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists) throw new ErrorResponse("User already exists", 400);

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      accountType,
    },
  });

  res.status(201).json({
    success: user ? true : false,
    message: user ? "User created successfully" : "User already exists",
    data: user ? user : null,
  });
};

// login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new ErrorResponse("Please provide all fields", 400);

  // find user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new ErrorResponse("User not found", 404);

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new ErrorResponse("Invalid credentials", 401);

  // generate token
  const token = jwt.sign(
    { id: user.id, accountType: user.accountType },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.status(200).json({
    success: user ? true : false,
    message: user ? "User logged in successfully" : "User not found",
    data: user ? { user, token } : null,
  });
};
