import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface JwtPayload {
  userId: string;
}
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthenticatedRequest, 
  res: Response,
  next: NextFunction
) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não definido no ambiente");
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    res.status(403).json({ message: "Token inválido" });
    return;
  }
};
