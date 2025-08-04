import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { H3Event } from "h3";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

export interface JWTPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const signToken = (payload: { userId: string; username: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

export const verifyTokenFromEvent = (event: H3Event): JWTPayload | null => {
  try {
    // Try to get token from Authorization header
    const authHeader = getHeader(event, "authorization");
    let token = authHeader?.replace("Bearer ", "");

    // If no auth header, try to get from cookie
    if (!token) {
      token = getCookie(event, "auth-token");
    }

    if (!token) {
      return null;
    }

    return verifyToken(token);
  } catch {
    return null;
  }
};
