import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import { User } from "@/contexts/AuthContext";
import { axiosClient } from "@/axios/axios";
import { useWallet } from "@/contexts/WalletContext";

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransferModal = ({ open, onOpenChange }: TransferModalProps) => {
  const [step, setStep] = useState<"search" | "confirm">("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const { refreshFunc } = useWallet();

  const { data: filteredUsers } = useFetch<User[]>(
    `/user/search?search=${searchTerm ?? ""}`,
    [searchTerm]
  );

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setStep("confirm");
  };

  const handleTransfer = async () => {
    if (!selectedUser || !amount) {
      toast({
        title: "Enter all required fields",
        description: "Enter all required field. amount must be provided",
        variant: "destructive",
      });
      return;
    }

    try {
      await axiosClient.post("/banking-system/transfer", {
        toUserId: selectedUser._id,
        amount,
        note,
      });
      await refreshFunc?.();
    } catch (error) {
      toast({
        title: "An error occured",
        description: error.response.data.message,
        variant: "destructive",
      });
    }

    toast({
      title: "Transfer initiated",
      description: `$${parseFloat(amount).toLocaleString()} sent to ${
        selectedUser.firstName
      }`,
    });
    onOpenChange(false);
    // Reset form
    setStep("search");
    setSelectedUser(null);
    setAmount("");
    setNote("");
    setSearchTerm("");
  };

  const handleBack = () => {
    setStep("search");
    setSelectedUser(null);
    setAmount("");
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogDescription>
            {step === "search"
              ? "Search for a user to send money to"
              : "Review and confirm your transfer"}
          </DialogDescription>
        </DialogHeader>

        {step === "search" ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredUsers?.map((user) => (
                <Card
                  key={user._id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {(user.firstName[0] + user.lastName[0]).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {(
                        selectedUser?.firstName[0] + selectedUser?.lastName[0]
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {selectedUser?.firstName} {selectedUser?.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedUser?.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note for this transfer..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            {amount && (
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Transfer Amount
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ${parseFloat(amount).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleTransfer}
                className="flex-1"
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Send Money
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
