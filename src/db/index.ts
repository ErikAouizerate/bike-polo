import { drizzle } from "drizzle-orm/node-postgres";

import * as authSchema from "./schema/auth";
import * as businessSchema from "./schema/business";

const schema = {
  ...authSchema,
  ...businessSchema,
};

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  casing: "snake_case",
  schema,
});
