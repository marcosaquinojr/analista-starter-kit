import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL não definida — provisione o Neon e rode vercel env pull");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
