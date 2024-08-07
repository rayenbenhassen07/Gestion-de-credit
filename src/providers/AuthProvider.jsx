"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getCurrentUser from "@/actions/getCurrentUser";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser && router.pathname !== "/login") {
        router.push("/login");
      } else {
        setUser(currentUser);
        console.log(currentUser);
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return <div>...</div>;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
