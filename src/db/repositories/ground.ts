"use server";

import { db } from "@/db";
import { groundSchema } from "@/db/schema/business";
import { eq } from "drizzle-orm";
import { Ground } from "@/db/schema";

export const getGroundById = async (id: string) => {
  return await db.query.groundSchema.findFirst({
    where: (g, { eq }) => eq(g.id, id),
  });
};

export const getGround = async (slug: number) => {
  return await db.query.groundSchema.findFirst({
    where: (g, { eq }) => eq(g.slug, slug),
    with: {
      tournament: true,
    },
  });
};

export const deleteGround = async (id: string) => {
  try {
    const result = await db.delete(groundSchema).where(eq(groundSchema.id, id));

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error creating ground:", error);
    throw error;
  }
};

export const createGround = async ({
  name,
  tournamentId,
  timerDuration,
}: {
  name: string;
  tournamentId: string;
  timerDuration: number;
}) => {
  try {
    const result = await db
      .insert(groundSchema)
      .values({ name, timerDuration, tournamentId });

    return {
      success: true,
      data: result.rows[0],
    };
  } catch (error) {
    console.error("Error creating ground:", error);
    throw error;
  }
};
export const updateGround = async (
  groundId: string,
  updates: Partial<Ground>
) => {
  return await db
    .update(groundSchema)
    .set(updates)
    .where(eq(groundSchema.id, groundId));
};

export async function startTimer(groundId: string, timerStartTime: Date) {
  try {
    await db
      .update(groundSchema)
      .set({
        timerStatus: "started",
        timerStartTime,
        timerOffset: 0,
        gameStatus: true,
      })
      .where(eq(groundSchema.id, groundId));
  } catch (error) {
    console.error("Error starting game:", error);
    throw error;
  }
}

export async function pauseTimer(groundId: string, timerStopTime: Date) {
  try {
    const ground = await getGroundById(groundId);

    if (!ground) {
      throw new Error("Error in pauseTimer, bad groundId: " + groundId);
    }

    if (!ground.timerStartTime) {
      throw new Error("Error in pauseTimer, no timerStartTime: " + groundId);
    }

    const offset =
      (timerStopTime.getTime() - ground.timerStartTime.getTime()) / 1000;

    await db
      .update(groundSchema)
      .set({
        timerStatus: "paused",
        timerOffset: ground.timerOffset + offset,
      })
      .where(eq(groundSchema.id, groundId));
  } catch (error) {
    console.error("Error pausing game:", error);
    throw error;
  }
}

export async function resumeTimer(groundId: string, timerStartTime: Date) {
  try {
    await db
      .update(groundSchema)
      .set({
        timerStatus: "started",
        timerStartTime,
      })
      .where(eq(groundSchema.id, groundId));
  } catch (error) {
    console.error("Error resuming game:", error);
    throw error;
  }
}

export async function resetTimer(groundId: string) {
  try {
    await db
      .update(groundSchema)
      .set({
        timerStatus: "initialed",
        timerStartTime: null,
        timerOffset: 0,
      })
      .where(eq(groundSchema.id, groundId));
  } catch (error) {
    console.error("Error resetting game:", error);
    throw error;
  }
}

export async function resetGame(groundId: string) {
  try {
    await db
      .update(groundSchema)
      .set({
        timerStatus: "initialed",
        gameStatus: false,
        timerStartTime: null,
        timerOffset: 0,
        teamAScore: 0,
        teamBScore: 0,
      })
      .where(eq(groundSchema.id, groundId));
  } catch (error) {
    console.error("Error resetting game:", error);
    throw error;
  }
}
