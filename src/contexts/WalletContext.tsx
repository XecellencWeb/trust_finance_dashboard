import { createContext, ReactNode, useCallback, useContext } from "react";

import { useFetch } from "@/hooks/use-fetch";
import { toast } from "sonner";
import { axiosClient } from "@/axios/axios";
import { useNavigate } from "react-router-dom";

export type WithdrawRequest = {
  amount: number;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: "checking" | "savings" | "business";
  notes?: string;
};

export type WithdrawResponse = WithdrawRequest & {
  _id: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
};

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
  getWithdrawRequest?: (id: string) => ReturnType<typeof useFetch>;
  withdrawMoney?: (request: WithdrawRequest) => Promise<void>;
  recentWithdraws?: WithdrawResponse[];
}>({});

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const { data: walletData, refetch } = useFetch<BankAccount>("/wallet");
  const { data: recentWithdraws } = useFetch(`/withdraws/for-user`);

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

  const withdrawMoney = async (withdraw: WithdrawRequest) => {
    try {
      const loading = toast.loading("Processing...");
      const response = await axiosClient.post("/withdraws", withdraw);
      toast.dismiss(loading);
      navigate(`/withdraws/${response.data._id}`);
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };

  const getWithdrawRequest = (id: string) => useFetch(`/withdraws/${id}`, [id]);

  return (
    <WalletCntxt.Provider
      value={{
        refreshFunc,
        walletData,
        getTransactions,
        withdrawMoney,
        getWithdrawRequest,
        recentWithdraws,
      }}
    >
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
