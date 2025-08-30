import { useState } from "react";
import { StatCard } from "@/components/atoms/StatCard";
import { TransactionItem } from "@/components/atoms/TransactionItem";
import { DepositModal } from "@/components/organisms/DepositModal";
import { TransferModal } from "@/components/organisms/TransferModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Plus, Send, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { FormatterUtil } from "@/utils/formater";
import { useWallet } from "@/contexts/WalletContext";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

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

const Dashboard = () => {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const { walletData, getTransactions } = useWallet();

  const { data } = getTransactions({ limit: 15 });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid ">
        <StatCard
          title="Wallet Balance"
          value={FormatterUtil.formatCurrency(walletData?.balance ?? 0)}
          icon={DollarSign}
          trend={{ value: "12.5%", isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Perform common banking operations quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={() => setDepositModalOpen(true)}
              className="flex items-center space-x-2 text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Deposit Funds</span>
            </Button>
            <Button
              onClick={() => setTransferModalOpen(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Transfer Money</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest financial activities in your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(data as WalletTransactionResponse)?.txts?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions found</p>
              </div>
            ) : (
              (data as WalletTransactionResponse)?.txts?.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full
                      ${transaction.isDebit 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                        : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      }
                    `}>
                      {transaction.isDebit ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <p className="font-medium text-sm leading-none">
                        {transaction.transactionDescription}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {FormatterUtil.formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`
                      font-semibold text-sm
                      ${transaction.isDebit 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                      }
                    `}>
                      {transaction.isDebit ? '-' : '+'}
                      {FormatterUtil.formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <DepositModal
        open={depositModalOpen}
        onOpenChange={setDepositModalOpen}
      />
      <TransferModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
      />
    </div>
  );
};

export default Dashboard;