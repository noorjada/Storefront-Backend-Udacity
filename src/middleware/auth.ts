
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyAuthToken = (req: Request, res: Response, next: Function): void => {
  try {
    const authHeader = req.headers.authorization as string;
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch {
    res.status(401).json('Access denied, invalid token');
  }
};
