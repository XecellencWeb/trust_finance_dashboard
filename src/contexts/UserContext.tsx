import { usePaginationQuery } from "@/components/custom/custom-pagination";
import { useFetch } from "@/hooks/use-fetch";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { User } from "./AuthContext";
import { axiosClient } from "@/axios/axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export enum AccountStatus {
  active = "active",
  suspended = "suspended",
}

export type PaginationDataResponse<T> = {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  data: T[];
};

interface UserContextInterface {
  users: PaginationDataResponse<User>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setPage: (newPage: number) => void;
  suspendUser: (userId: string) => Promise<void>;
  reActivateAccount: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextInterface | null>(null);

const UserContextProvider = ({ children }) => {
  const { page, limit, setPage } = usePaginationQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users, refetch } = useFetch(
    `/user/all?page=${page}&limit=${limit}&search=${searchTerm}`
  );

  const suspendUser = async (userId: string) => {
    const willContinue = await new Promise((res) =>
      toast.custom((t) => (
        <Card>
          <CardHeader>Suspend Account</CardHeader>
          <CardContent>
            <CardDescription>
              Are you sure you want to suspend this user account?
            </CardDescription>
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                toast.dismiss(t);
                res(false);
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t);
                res(true);
              }}
              variant="destructive"
            >
              Yes
            </Button>
          </CardFooter>
        </Card>
      ))
    );

    if (!willContinue) return;

    try {
      const loading = toast.loading("Suspending account...");
      await axiosClient.patch(
        `/user/update-account/${userId}/${AccountStatus.suspended}`
      );
      await refetch();
      toast.dismiss(loading);
      toast.success("Successfully suspended user");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const reActivateAccount = async (userId: string) => {
    try {
      const loading = toast.loading("Activating account...");
      await axiosClient.patch(
        `/user/update-account/${userId}/${AccountStatus.active}`
      );
      await refetch();
      toast.dismiss(loading);
      toast.success("Successfully activated user account");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const deleteUser = async (userId: string) => {
    const willContinue = await new Promise((res) =>
      toast.custom((t) => (
        <Card>
          <CardHeader>Delete Account</CardHeader>
          <CardContent>
            <CardDescription>
              Are you sure you want to delete this user account?
            </CardDescription>
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                toast.dismiss(t);
                res(false);
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                toast.dismiss(t);
                res(true);
              }}
              variant="destructive"
            >
              Yes
            </Button>
          </CardFooter>
        </Card>
      ))
    );

    if (!willContinue) return;

    try {
      const loading = toast.loading("Deleting account...");
      await axiosClient.delete(`/user/delete-account/${userId}`);
      await refetch();
      toast.dismiss(loading);
      toast.success("Successfully deleted user account");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const contextValues: UserContextInterface = {
    searchTerm,
    users,
    setSearchTerm,
    setPage,
    suspendUser,
    deleteUser,
    reActivateAccount,
  };

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an UserContextProvider");
  }
  return context;
}
