import { prisma } from "../../lib/prisma";
import { verifyToken } from "../../lib/auth";

export default defineEventHandler(async (event) => {
  // Only allow GET method
  if (getMethod(event) !== "GET") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  try {
    // Get token from cookie
    const token = getCookie(event, "auth-token");

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "No authentication token found",
      });
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid or expired token",
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return {
      success: true,
      user,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: (error as Error).message || "Internal Server Error",
      statusCode:
        typeof error === "object" && error !== null && "statusCode" in error
          ? (error as Error & { statusCode?: number }).statusCode || 500
          : 500,
    };
  }
});
