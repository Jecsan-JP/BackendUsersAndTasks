import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (
  payload: object,
  expiresIn: string | number = "1h"
) => {
  const JWT_SECRET = process.env.JWT_SECRET!;

  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  const JWT_SECRET = process.env.JWT_SECRET!;

  return jwt.verify(token, JWT_SECRET);
};
