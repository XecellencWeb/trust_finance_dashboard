import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardDescription } from "./ui/card";
import { Loader2 } from "lucide-react";
import useHasAdminPermission from "@/hooks/use-has-admin-permission";

interface ProtectedRouteProps {
  children: React.ReactNode;
  restricted?: boolean; // if true, bypasses admin permission check
}

export function ProtectedRoute({
  children,
  restricted = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const hasAdminPermission = useHasAdminPermission();

  // Show loader while auth is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Card className="w-full max-w-md p-6 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-muted-foreground" size={40} />
          <CardDescription>
            Please wait while your account details are loading...
          </CardDescription>
        </Card>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route is restricted and user lacks admin permission
  if (restricted && !hasAdminPermission) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return <>{children}</>;
}
