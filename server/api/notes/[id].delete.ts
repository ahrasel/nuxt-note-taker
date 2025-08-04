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

    // MongoDB ObjectId validation (basic check for 24 char hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(noteId)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid note ID format",
      });
    }

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: user.userId,
      },
    });

    if (!existingNote) {
      throw createError({
        statusCode: 404,
        statusMessage: "Note not found",
      });
    }

    // Delete note from database
    await prisma.note.delete({
      where: { id: noteId },
    });

    return {
      success: true,
      message: "Note deleted successfully",
    };
  } catch (error: unknown) {
    console.error("Error deleting note:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete note",
    });
  }
});
