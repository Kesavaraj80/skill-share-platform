import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userType: "provider" | "user";
}

export default function Sidebar({ userType }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: `/${userType}/dashboard`,
      icon: Home,
    },
    {
      name: "Profile",
      href: `/${userType}/profile`,
      icon: User,
    },
    {
      name: "Settings",
      href: `/${userType}/settings`,
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Skill Share</h2>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-gray-100")}
              onClick={() => router.push(item.href)}
            >
              <item.icon
                className={cn(
                  "mr-2 h-5 w-5",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              />
              {item.name}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
