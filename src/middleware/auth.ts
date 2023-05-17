import { Request, Response ,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "../utils/types";
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
  } catch (err) {
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated!!.');
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
