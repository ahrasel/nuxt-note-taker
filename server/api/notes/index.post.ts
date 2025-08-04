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

    // Parse request body
    const body = await readBody(event);
    const {
      title,
      content,
      category = "Personal",
      color = "bg-gray-100 dark:bg-gray-900/20",
      pinned = false,
    } = body;

    // Validate required fields
    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: "Title and content are required",
      });
    }

    // Create note in database
    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        color,
        pinned,
        userId: user.userId,
      },
    });

    return {
      success: true,
      data: note,
    };
  } catch (error: unknown) {
    console.error("Error creating note:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create note",
    });
  }
});
