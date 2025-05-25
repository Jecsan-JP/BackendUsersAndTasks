import { verifyToken } from "@/utils/jwt.util";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "@/errors/errors"; // O tu clase de error personalizada

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ValidationError({ message: "Token no proporcionado" }));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return next(new ValidationError({ message: "Token inválido o expirado" }));
  }
};