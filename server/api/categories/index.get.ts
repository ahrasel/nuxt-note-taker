import { verifyTokenFromEvent } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Verify authentication
    const user = verifyTokenFromEvent(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    // Get unique categories for this user
    const notes = await prisma.note.findMany({
      where: {
        userId: user.userId,
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    // Extract unique categories and filter out empty ones
    const userCategories = notes
      .map((note) => note.category)
      .filter((category) => category && category.trim() !== "");

    // Add default categories and merge with user categories
    const defaultCategories = ["Work", "Personal", "Ideas", "Important"];
    const allCategories = [...new Set([...defaultCategories, ...userCategories])].sort();

    return {
      success: true,
      data: allCategories,
    };
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);

    // If it's an auth error, re-throw it
    if (error && typeof error === "object" && "statusCode" in error && error.statusCode === 401) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch categories",
    });
  }
});
