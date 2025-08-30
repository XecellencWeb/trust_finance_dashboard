import { TransactionItem } from "@/components/atoms/TransactionItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const Transactions = () => {
  const mockTransactions = [
    {
      id: "1",
      type: "deposit" as const,
      amount: 5000,
      currency: "USD",
      status: "completed" as const,
      timestamp: "2 hours ago",
      crypto: { symbol: "BTC", amount: 0.07692308 }
    },
    {
      id: "2",
      type: "transfer" as const,
      amount: 1200,
      currency: "USD",
      user: { name: "John Doe", email: "john@example.com" },
      status: "pending" as const,
      timestamp: "4 hours ago"
    },
    {
      id: "3",
      type: "deposit" as const,
      amount: 800,
      currency: "USD",
      status: "completed" as const,
      timestamp: "1 day ago",
      crypto: { symbol: "ETH", amount: 0.25 }
    },
    {
      id: "4",
      type: "transfer" as const,
      amount: 3500,
      currency: "USD",
      user: { name: "Sarah Smith", email: "sarah@example.com" },
      status: "completed" as const,
      timestamp: "2 days ago"
    },
    {
      id: "5",
      type: "withdrawal" as const,
      amount: 1000,
      currency: "USD",
      status: "completed" as const,
      timestamp: "3 days ago"
    },
    {
      id: "6",
      type: "deposit" as const,
      amount: 2500,
      currency: "USD",
      status: "failed" as const,
      timestamp: "1 week ago",
      crypto: { symbol: "USDT", amount: 2500 }
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">
          View and manage all financial transactions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-9" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Complete transaction history for your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {mockTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} {...transaction} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;