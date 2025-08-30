import { axiosClient } from "@/axios/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  useDebouncedCallback,
  useDebouncedCallbackOnValueChange,
} from "@/hooks/use-debounce";
import { useFetch } from "@/hooks/use-fetch";
import { toast } from "@/hooks/use-toast";
import { FormatterUtil } from "@/utils/formater";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export enum CryptoDepositsStatus {
  pending = "Pending",
  confirmed = "Confirmed",
  failed = "Failed",
}

export interface CryptoDeposit {
  _id: string;
  userId: string;
  amountInCrypto: number;
  amountInUSD: number;
  cryptoWalletName: string;
  cryptoWalletSymbol: string;
  status: CryptoDepositsStatus; // adjust if there are more possible statuses
  createdAt: string; // or `Date` if you'll parse it
  updatedAt: string; // or `Date`
  __v: number;
}

const DepositCard = ({
  deposit,
  refetchFunc,
}: {
  deposit: CryptoDeposit;
  refetchFunc: () => Promise<void>;
}) => {
  const [depositStatus, setDepositStatus] = useState(deposit.status);
  const [updating, setUpdating] = useState(false);

  useDebouncedCallbackOnValueChange(
    async () => {
      setUpdating(true);

      try {
        await axiosClient.patch(
          `/crypto-deposits/update-status/${deposit._id}`,
          {
            status: depositStatus,
          }
        );
        await refetchFunc();
      } catch (error) {
        toast({
          title: "An error occured",
          description: error.response.data.message,
          variant: "destructive",
        });
      }

      setUpdating(false);
    },
    [depositStatus],
    250
  );

  return (
    <Card>
      <div className="p-4 flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{deposit.cryptoWalletSymbol}</AvatarFallback>
        </Avatar>
        <div className="flex gap-2 items-center justify-between flex-wrap flex-1">
          <div className="flex flex-col gap-1">
            <div className=" flex gap-2 items-center">
              <CardTitle>{deposit.cryptoWalletName} deposit</CardTitle>
              <Badge variant="outline">{deposit.status}</Badge>
            </div>
            <CardDescription>
              {FormatterUtil.formatCurrency(deposit.amountInUSD)} Equivalent to{" "}
              {deposit.amountInCrypto} {deposit.cryptoWalletName} deposited at{" "}
              {FormatterUtil.formatDate(deposit.createdAt)}
            </CardDescription>
          </div>

          <div className="">
            {updating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Label>Update deposit status</Label>
                <Select
                  value={depositStatus}
                  onValueChange={(value) =>
                    setDepositStatus(value as CryptoDepositsStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Update Deposit Status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CryptoDepositsStatus).map((status) => (
                      <SelectItem value={status}>
                        <div className="px-4">{status}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const DepositsPage = () => {
  const { data, refetch } = useFetch<CryptoDeposit[]>(
    "/crypto-deposits/latest"
  );

  return (
    <div className="max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>User Deposits</CardTitle>
          <CardDescription>Deposits made by users.</CardDescription>
        </CardHeader>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <CardDescription>
            View all deposits that are currently being made
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {data?.map((deposit) => (
            <DepositCard key={deposit._id} refetchFunc={refetch} deposit={deposit} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositsPage;
