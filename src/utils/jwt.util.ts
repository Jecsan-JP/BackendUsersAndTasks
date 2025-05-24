import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (
  payload: object,
  expiresIn: string | number = "1h"
) => {
  const options: SignOptions = { expiresIn: Number(expiresIn) };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
