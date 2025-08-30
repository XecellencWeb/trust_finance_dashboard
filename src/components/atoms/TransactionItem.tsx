import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionItemProps {
  id: string;
  type: "deposit" | "transfer" | "withdrawal";
  amount: number;
  currency: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: "completed" | "pending" | "failed";
  timestamp: string;
  crypto?: {
    symbol: string;
    amount: number;
  };
}

export const TransactionItem = ({ 
  type, 
  amount, 
  currency, 
  user, 
  status, 
  timestamp, 
  crypto 
}: TransactionItemProps) => {
  const getTypeColor = () => {
    switch (type) {
      case "deposit": return "text-success";
      case "transfer": return "text-primary";
      case "withdrawal": return "text-warning";
      default: return "text-foreground";
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case "completed": return "default";
      case "pending": return "secondary";
      case "failed": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user?.avatar} />
        <AvatarFallback>
          {user?.name?.split(" ").map(n => n[0]).join("") || "TX"}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {type === "deposit" && "Crypto Deposit"}
            {type === "transfer" && `Transfer ${user?.name ? `to ${user.name}` : ""}`}
            {type === "withdrawal" && "Withdrawal"}
          </p>
          <div className={cn("text-sm font-medium", getTypeColor())}>
            {type === "deposit" || type === "transfer" ? "+" : "-"}
            ${amount.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusVariant()} className="text-xs">
            {status}
          </Badge>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
          {crypto && (
            <span className="text-xs text-muted-foreground">
              {crypto.amount} {crypto.symbol}
            </span>
          )}
        </div>
        
        {user?.email && (
          <p className="text-xs text-muted-foreground">{user.email}</p>
        )}
      </div>
    </div>
  );
};