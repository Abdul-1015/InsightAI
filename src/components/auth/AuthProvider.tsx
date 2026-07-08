import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  provider: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("🚀 AuthProvider Render");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    console.log("📡 Fetching current user...");

    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      console.log("Status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log("User Response:", data);

      setUser(data.user ?? null);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      console.log("✅ Finished loading");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  async function signOut() {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }

    setUser(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}