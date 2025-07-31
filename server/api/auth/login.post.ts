import { prisma } from "../../lib/prisma";
import { comparePassword, signToken } from "../../lib/auth";

export default defineEventHandler(async (event) => {
  // Only allow POST method
  if (getMethod(event) !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  try {
    const body = await readBody(event);
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username and password are required",
      });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      username: user.username,
    });

    // Set secure cookie
    setCookie(event, "auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (error: unknown) {
    // If it's already a createError, throw it as is
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Log the error for debugging
    console.error("Login error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
