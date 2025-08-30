import { axiosClient } from "@/axios/axios";
import { ACCESS_TOKEN_NAME } from "@/constants";
import { useFetch } from "@/hooks/use-fetch";
import { setSharedCookie } from "@/utils/cookie";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BankAccount } from "./WalletContext";
import { AccountStatus } from "./UserContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LogOut } from "lucide-react";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // ISO date string
  ssn: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  accountType: "checking" | "savings" | string; // adjust if needed
  username: string;
  isAdmin: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  wallet?: BankAccount;
  accountStatus: AccountStatus
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { loading } = useFetch("/user/profile", [], {
    callback: (user) => {
      setUser(user);
      setIsLoading(false);
    },
  });

  // Check for existing authentication on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");

    if (storedAuth === "true" && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axiosClient.post("/auth/login", {
        username,
        password,
      });

      setSharedCookie(ACCESS_TOKEN_NAME, response.data.token);

      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    // Clear the access token cookie
    setSharedCookie(ACCESS_TOKEN_NAME, "");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: loading || isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {user?.accountStatus === AccountStatus.suspended ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-md p-6 text-center space-y-6">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Account Suspended
              </h1>
              <p className="text-gray-600">
                Your account has been temporarily suspended. Please contact support for assistance.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                If you believe this is an error, please reach out to our support team.
              </p>
              
              <Button 
                onClick={logout}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}