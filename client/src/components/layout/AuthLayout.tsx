import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/UserContext";
import { authAPI } from "@/services/api";

interface AuthLayoutProps {
  children: React.ReactNode;
  userType: "provider" | "user";
}

export default function AuthLayout({ children, userType }: AuthLayoutProps) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      authAPI
        .me()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          router.push("/auth/login");
        });

      // Convert both to lowercase for case-insensitive comparison
      const userRole = user.role?.toLowerCase();
      const expectedRole = userType.toLowerCase();

      if (userRole !== expectedRole) {
        router.push(`/${userRole}/dashboard`);
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, userType, user.role]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar userType={userType} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
function setUser(data: any) {
  throw new Error("Function not implemented.");
}
