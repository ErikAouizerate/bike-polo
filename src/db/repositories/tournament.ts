import { db } from "@/db";
import { eq, InferSelectModel, SQLWrapper } from "drizzle-orm";
import { groundSchema, tournamentSchema } from "@/db/schema/business";
import { Tournament } from "@/db/schema";

type TournamentWithGrounds = Tournament & {
  grounds: InferSelectModel<typeof groundSchema>[];
};

type OrderHelpers = {
  asc: (val: SQLWrapper) => unknown;
  desc: (val: SQLWrapper) => unknown;
};

export const getTournamentsWithGrounds = async (userId: string) => {
  return (await db.query.tournamentSchema.findMany({
    where: (t, { eq }) => eq(t.userId, userId),
    with: {
      grounds: {
        orderBy: (g: typeof groundSchema, { desc }: OrderHelpers) => [
          desc(g.id),
        ],
      },
    },
    orderBy: (tournamentSchema, { asc }) => [asc(tournamentSchema.createdAt)],
  })) as TournamentWithGrounds[];
};

export const getTournament = async (tournamentId: string) => {
  return await db.query.tournamentSchema.findFirst({
    where: (t, { eq }) => eq(t.id, tournamentId),
  });
};

export const updateTournament = async (
  tournamentId: string,
  updates: Partial<Tournament>
) => {
  return await db
    .update(tournamentSchema)
    .set(updates)
    .where(eq(tournamentSchema.id, tournamentId));
};
