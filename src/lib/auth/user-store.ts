import type { User } from "./types";

const users = new Map<string, User>();
const emailIndex = new Map<string, string>();

export function getUser(id: string): User | undefined {
  return users.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  const id = emailIndex.get(email);
  return id ? users.get(id) : undefined;
}

export function upsertUser(data: {
  email: string;
  name: string;
  avatar: string | null;
  provider: "google" | "github";
}): User {
  const existing = getUserByEmail(data.email);
  if (existing) {
    const updated: User = { ...existing, ...data };
    users.set(existing.id, updated);
    return updated;
  }

  const id = crypto.randomUUID();
  const user: User = {
    id,
    email: data.email,
    name: data.name,
    avatar: data.avatar,
    provider: data.provider,
    createdAt: Date.now(),
  };

  users.set(id, user);
  emailIndex.set(data.email, id);
  return user;
}
