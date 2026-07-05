import useAuth from "../hooks/useAuth";
import { logout } from "../services/authService";
import Button from "./ui/Button";

export default function AuthStatus() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">

      <span className="text-sm text-gray-600">
        {user.email}
      </span>

      <Button onClick={logout} className="bg-red-500">
        Logout
      </Button>

    </div>
  );
}
