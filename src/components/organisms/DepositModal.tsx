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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import { axiosClient } from "@/axios/axios";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const cryptoOptions = [
  { symbol: "BTC", name: "Bitcoin", rate: 65000 },
  { symbol: "ETH", name: "Ethereum", rate: 3200 },
  { symbol: "USDT", name: "Tether", rate: 1 },
];

export const DepositModal = ({ open, onOpenChange }: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [step, setStep] = useState<"amount" | "wallet">("amount");
  const { toast } = useToast();
  const [loading, setIsLoading] = useState(false);

  const { data: rightAddress } = useFetch(
    `/admin/config/wallet-address/${selectedCrypto.toLowerCase()}`,
    [selectedCrypto]
  );

  const selectedCryptoData = cryptoOptions.find(
    (crypto) => crypto.name === selectedCrypto
  );
  const cryptoAmount =
    selectedCryptoData && amount
      ? (parseFloat(amount) / selectedCryptoData.rate).toFixed(8)
      : "0";

  const handleCopyAddress = () => {
    if (selectedCryptoData) {
      navigator.clipboard.writeText(rightAddress);
      toast({
        title: "Address copied",
        description: "Wallet address has been copied to clipboard",
      });
    }
  };

  const handleContinue = () => {
    if (amount && selectedCrypto) {
      setStep("wallet");
    }
  };

  const handleReset = () => {
    setStep("amount");
    setAmount("");
    setSelectedCrypto("");
  };

  const makeCryptoDeposit = async () => {
    setIsLoading(true);
    try {
      await axiosClient.post("/crypto-deposits", {
        amountInCrypto: cryptoAmount,
        amountInUSD: amount,
        cryptoWalletName: selectedCrypto,
        cryptoWalletSymbol: selectedCryptoData.symbol,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "An error occured",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            {step === "amount"
              ? "Choose the amount and cryptocurrency for your deposit"
              : "Transfer the exact amount to the wallet address below"}
          </DialogDescription>
        </DialogHeader>

        {step === "amount" ? (
          <div className="space-y-4">
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
              <Label htmlFor="crypto">Cryptocurrency</Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoOptions.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.name}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{crypto.symbol}</span>
                        <span className="text-muted-foreground">
                          - {crypto.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {amount && selectedCrypto && (
              <Card>
                <CardContent className="pt-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold">
                      {cryptoAmount} {selectedCrypto}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Equivalent to ${parseFloat(amount).toLocaleString()} USD
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={handleContinue}
              className="w-full"
              disabled={!amount || !selectedCrypto}
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center space-y-2">
                  <div className="text-lg font-semibold">Send Exactly</div>
                  <div className="text-2xl font-bold text-primary">
                    {cryptoAmount} {selectedCrypto}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${parseFloat(amount).toLocaleString()} USD
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={rightAddress || ""}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Important Notes:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Send only {selectedCrypto} to this address</li>
                <li>• Your deposit will be credited after 3 confirmations</li>
                <li>• Minimum deposit: $10 USD</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              {loading ? (
                <Loader2 size={40} className="animate-spin mx-auto " />
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button onClick={makeCryptoDeposit} className="flex-1">
                    Done
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
