import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  pgEnum,
  real,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { relations } from "drizzle-orm";

export const tournamentSchema = pgTable("tournament", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  image: text(),
  streamStyle: text().notNull().default("neon"),
  createdAt: timestamp()
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp()
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const userToTournamentsRelations = relations(user, ({ many }) => ({
  tournaments: many(tournamentSchema),
}));

export const tournamentsToUserRelations = relations(
  tournamentSchema,
  ({ one }) => ({
    user: one(user, {
      fields: [tournamentSchema.userId],
      references: [user.id],
    }),
  })
);

export const timerStatusEnum = pgEnum("timer_status", [
  "initialed",
  "started",
  "paused",
]);

export const groundSchema = pgTable("ground", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  slug: serial().notNull().unique(),

  image: text(),

  teamA: text().notNull().default("Team A"),
  teamB: text().notNull().default("Team B"),
  teamAScore: integer().notNull().default(0),
  teamBScore: integer().notNull().default(0),
  timerDuration: integer().notNull().default(720),
  timerStartTime: timestamp(),
  timerStatus: timerStatusEnum().notNull().default("initialed"),
  timerOffset: real().notNull().default(0),

  gameStatus: boolean().notNull().default(false),
  isStreaming: boolean().notNull().default(false),

  createdAt: timestamp()
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp()
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  tournamentId: text()
    .notNull()
    .references(() => tournamentSchema.id, { onDelete: "cascade" }),
});

export const tournamentToGroundsRelations = relations(
  tournamentSchema,
  ({ many }) => ({
    grounds: many(groundSchema), // <- name here must match your query key!
  })
);

export const groundsToTournamentRelations = relations(
  groundSchema,
  ({ one }) => ({
    tournament: one(tournamentSchema, {
      fields: [groundSchema.tournamentId],
      references: [tournamentSchema.id],
    }),
  })
);
