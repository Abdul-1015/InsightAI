import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { users } from "../db/schema";
import type { User } from "./types";

function rowToUser(row: typeof users.$inferSelect): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatar: row.avatar,
    provider: row.provider as "google" | "github",
    createdAt: row.createdAt.getTime(),
  };
}

export async function getUser(id: string): Promise<User | undefined> {
  const db = getDb();
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (rows.length === 0) return undefined;
  return rowToUser(rows[0]);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = getDb();
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (rows.length === 0) return undefined;
  return rowToUser(rows[0]);
}

export async function upsertUser(data: {
  email: string;
  name: string;
  avatar: string | null;
  provider: "google" | "github";
}): Promise<User> {
  const db = getDb();
  const existing = await getUserByEmail(data.email);

  if (existing) {
    const updated = await db
      .update(users)
      .set({ name: data.name, avatar: data.avatar })
      .where(eq(users.id, existing.id))
      .returning();
    return rowToUser(updated[0]);
  }

  const inserted = await db
    .insert(users)
    .values({
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      provider: data.provider,
    })
    .returning();
  return rowToUser(inserted[0]);
}
