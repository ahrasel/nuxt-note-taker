export default defineEventHandler(async (event) => {
  // Only allow POST method
  if (getMethod(event) !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  }

  try {
    // Clear the auth cookie
    setCookie(event, "auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
    });

    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error: unknown) {
    console.error("Logout error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
