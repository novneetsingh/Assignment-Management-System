import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";

// Auth middleware
export const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ErrorResponse("Token missing", 401);

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) throw new ErrorResponse("Invalid token", 401);

  // add decoded token payload to the request object
  req.user = decoded;

  next();
};

// Professor middleware
export const isProfessor = async (req, res, next) => {
  if (req.user.accountType !== "Professor")
    throw new ErrorResponse(
      "Access denied. This is a protected route for professors only",
      403
    );

  next();
};
