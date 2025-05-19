"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import { authAPI } from "@/services/api";

export default function App({ children }: { children: React.ReactNode }) {
  // const queryCLient = new QueryClient();

  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Check if token is valid by calling /me endpoint
          const userData = await authAPI.getCurrentUser();
          setUser(userData);

          // If user is logged in and tries to access auth pages, redirect to appropriate dashboard
          if (pathname === "/auth/login" || pathname === "/auth/signup") {
            router.push(`/${userData.role.toLowerCase()}/dashboard`);
          }
        } catch (error) {
          // If token is invalid, clear it and redirect to login
          localStorage.removeItem("token");
          if (pathname !== "/auth/login" && pathname !== "/auth/signup") {
            router.push("/auth/login");
          }
        }
      } else if (pathname !== "/auth/login" && pathname !== "/auth/signup") {
        // If no token and not on auth pages, redirect to login
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [pathname, router, setUser]);

  return (
    <div className="w-screen h-screen min-h-screen min-w-screen p-0 m-0">
      {children}
    </div>
  );
}
