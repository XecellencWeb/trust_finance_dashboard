import { createContext, ReactNode, useCallback, useContext } from "react";

import { useFetch } from "@/hooks/use-fetch";

export interface WalletTransaction {
  _id: string;
  amount: number;
  isDebit: boolean;
  walletId: string;
  transactionDescription: string;
  depositId?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WalletTransactionResponse {
  txts: WalletTransaction[];
  total: number;
}

export interface BankAccount {
  _id: string;
  balance: number;
  userId: string; // reference to User._id
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  __v: number;
}

const WalletCntxt = createContext<{
  refreshFunc?: () => Promise<void>;
  getTransactions?: ({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }) => ReturnType<typeof useFetch>;
  walletData?: BankAccount;
}>({});

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const { data: walletData, refetch } = useFetch<BankAccount>("/wallet");

  const refreshFunc = useCallback(refetch, [refetch]);

  const getTransactions = ({
    page = 1,
    limit = 5,
  }: {
    page: number;
    limit: number;
  }) =>
    useFetch<WalletTransactionResponse>(
      `/wallet/transactions/${walletData?._id}?page=${page}&limit=${limit}`,
      [walletData?._id]
    );

  return (
    <WalletCntxt.Provider value={{ refreshFunc, walletData, getTransactions }}>
      {children}
    </WalletCntxt.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletCntxt);

  if (!context)
    throw new Error("useWallet must be used within a WalletContextProvider");

  return context;
};


export default WalletContextProvider;
