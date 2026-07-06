export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  provider: "google" | "github";
  createdAt: number;
}

export interface Session {
  userId: string;
  expiresAt: number;
}
