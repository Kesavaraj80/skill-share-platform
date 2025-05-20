import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { ClipboardListIcon, HandCoinsIcon, Home } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
interface SidebarProps {
  userType: "provider" | "user";
}

export default function Sidebar({ userType }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = useMemo(
    () =>
      [
        {
          name: "Dashboard",
          href: `/${userType}/dashboard`,
          icon: Home,
          allowedRoles: ["user", "provider"],
        },
        {
          name: "Your Tasks",
          href: `/${userType}/tasks`,
          icon: ClipboardListIcon,
          allowedRoles: ["provider"],
        },
        {
          name: "All Tasks",
          href: `/${userType}/tasks/all`,
          icon: ClipboardListIcon,
          allowedRoles: ["provider"],
        },
        {
          name: "Offers",
          href: `/${userType}/offers`,
          icon: HandCoinsIcon,
          allowedRoles: ["user"],
        },
      ].filter((item) => {
        if (item.allowedRoles.includes(userType)) {
          return true;
        }
        return false;
      }),
    [userType]
  );

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
