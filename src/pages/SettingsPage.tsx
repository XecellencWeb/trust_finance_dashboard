import { axiosClient } from "@/axios/axios";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebouncedCallbackOnValueChange } from "@/hooks/use-debounce";
import { useFetch } from "@/hooks/use-fetch";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export interface CryptoDepositInfo {
  network: string;
  address: string;
  minDeposit: number;
  icon: string;
  depositNote: string;
}

export interface AdminCryptoAddresses {
  bitcoin: CryptoDepositInfo;
  tether: CryptoDepositInfo;
  ethereum: CryptoDepositInfo;
}

const SettingsPage = () => {
  const [wallets, setWallets] = useState<AdminCryptoAddresses | {}>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useFetch<AdminCryptoAddresses>("/admin/config/wallets", [], {
    callback: (data) => {
      setWallets(data);
    },
  });

  useDebouncedCallbackOnValueChange(async () => {
    if(!Object.values(wallets).length) return;
    
    setIsUpdating(true);
    try {
      await axiosClient.patch("/admin/config/wallets", wallets);
      toast({
        title: "Success",
        description: "Wallet addresses updated successfully",
      });
    } catch (error) {
      toast({
        title: "An error occured when making change",
        description: error.response.data.message ?? "Unknown error occured",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [wallets]);

  return (
    <div className="max-w-7xl mx-auto px-4 relative">
      <Card>
        <CardHeader>
          <CardTitle>Manage Wallet Address</CardTitle>

          <CardDescription>
            View and edit your wallet address details.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mt-8">
        <div className="p-4">
          {Object.entries(wallets)?.map(
            ([key, wallet]: [string, CryptoDepositInfo]) => (
              <div key={key} className="space-y-1 my-4">
                <Label htmlFor={key} className="font-bold capitalize text-md">
                  {key}
                </Label>
                <Input
                  value={wallet.address}
                  onChange={(e) =>
                    setWallets((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], address: e.target.value },
                    }))
                  }
                />
              </div>
            )
          )}
        </div>
      </Card>

      {/* Loading indicator at bottom left */}
      {isUpdating && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-gray-700">Updating...</span>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;