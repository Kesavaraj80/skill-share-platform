"use client";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthUserT, UserContext } from "@/context/UserContext";
import { authAPI } from "@/services/api";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
export default function App({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUserT>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    fullName: "",
    role: "",
  });

  const userProviderValue = useMemo(
    () => ({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      setUser: setUser,
    }),
    [user]
  );

  useEffect(() => {
    if (
      ![
        "/auth/login",
        "/auth/signup",
        "/",
        "/auth/signup/user",
        "/auth/signup/provider",
      ].includes(pathname)
    ) {
      const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if (token) {
          try {
            const userData = await authAPI.me();
            console.log(userData);
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
    }
  }, [pathname, router, setUser]);

  const hideBar = useMemo(
    () =>
      [
        "/auth/login",
        "/auth/signup",
        "/",
        "/auth/signup/user",
        "/auth/signup/provider",
      ].includes(pathname),
    [pathname]
  );

  return (
    <>
      <UserContext.Provider value={userProviderValue}>
        {hideBar && user.id === "" ? (
          <main className="flex-1 overflow-y-auto">{children}</main>
        ) : (
          <div className="min-h-screen bg-gray-50">
            <Toaster />
            <Header />
            <div className="flex h-[calc(100vh-5rem)]">
              <Sidebar
                userType={user.role === "PROVIDER" ? "provider" : "user"}
              />

              <main className="flex-1 overflow-y-auto p-8">
                {user.id !== "" && children}
              </main>
            </div>
          </div>
        )}
      </UserContext.Provider>
    </>
  );
}
