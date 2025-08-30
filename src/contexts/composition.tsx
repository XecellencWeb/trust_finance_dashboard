import { AuthProvider } from "./AuthContext";
import UserContextProvider from "./UserContext";
import WalletContextProvider from "./WalletContext";

const Providers = [AuthProvider, WalletContextProvider, UserContextProvider];

export const AllContext = Providers.reduce(
  (ACC, CURR) =>
    ({ children }) =>
      (
        <CURR>
          <ACC>{children}</ACC>
        </CURR>
      ),
  ({ children }) => <>{children}</>
);
