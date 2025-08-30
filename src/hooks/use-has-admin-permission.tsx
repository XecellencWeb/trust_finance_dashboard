import { useAuth } from "@/contexts/AuthContext";

const useHasAdminPermission = () => {
  const { user } = useAuth();
  return user?.isAdmin ?? false;
};

export default useHasAdminPermission;
