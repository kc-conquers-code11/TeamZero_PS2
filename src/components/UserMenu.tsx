import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

export default function UserMenu() {
  const [user, setUserState] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUserState(getUser());
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        {user.name}
      </NavigationMenuTrigger>

      <NavigationMenuContent>
        <div className="p-4 w-64 space-y-3">
          <div>
            <p className="font-bold">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {auth.currentUser?.email}
            </p>
          </div>

          <div className="border-t pt-3">
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}