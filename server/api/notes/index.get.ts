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

    // Get query parameters
    const query = getQuery(event);
    const { search, status } = query;

    // Build where clause
    const where: {
      userId: number;
      completed?: boolean;
      archived?: boolean;
      OR?: Array<
        | { title?: { contains: string; mode: string } }
        | { content?: { contains: string; mode: string } }
      >;
    } = {
      userId: user.userId,
    };

    // Filter by status
    if (status === "completed") {
      where.completed = true;
      where.archived = false;
    } else if (status === "archived") {
      where.archived = true;
    } else if (status === "active") {
      where.completed = false;
      where.archived = false;
    }

    // Filter by search query
    if (search && typeof search === "string") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get notes from database
    const notes = await prisma.note.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
    });

    return {
      success: true,
      data: notes,
    };
  } catch (error: unknown) {
    console.error("Error fetching notes:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch notes",
    });
  }
});
