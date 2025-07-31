import { prisma } from "../../lib/prisma";
import { hashPassword, signToken } from "../../lib/auth";

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
    const { username, password, email } = body;

    // Validate input
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username and password are required",
      });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: "Username already exists",
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        throw createError({
          statusCode: 409,
          statusMessage: "Email already exists",
        });
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email: email || null,
      },
    });

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
      message: "User created successfully",
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
    console.error("Registration error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
