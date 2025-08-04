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

    // Get note ID from route parameters
    const noteId = getRouterParam(event, "id");
    if (!noteId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Note ID is required",
      });
    }

    const id = parseInt(noteId);
    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid note ID",
      });
    }

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!existingNote) {
      throw createError({
        statusCode: 404,
        statusMessage: "Note not found",
      });
    }

    // Parse request body
    const body = await readBody(event);
    const { title, content, category, color, pinned, completed, archived } = body;

    // Update note in database
    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(color !== undefined && { color }),
        ...(pinned !== undefined && { pinned }),
        ...(completed !== undefined && { completed }),
        ...(archived !== undefined && { archived }),
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      data: updatedNote,
    };
  } catch (error: unknown) {
    console.error("Error updating note:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update note",
    });
  }
});
