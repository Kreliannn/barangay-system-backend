import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/request.type";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET || "defaultsecret";



export const authenticateJWT = (request: AuthRequest, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided");
     response.status(401).json({ message: "No token provided" });
     return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    const { id } = decoded as { id: string };
    request.id = id;
    next();
  } catch (err) {
    console.log(err)
     response.status(401).json({ message: "Invalid token" });
  }
};
