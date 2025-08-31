import { FileDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useWallet } from "@/contexts/WalletContext";
import { useState } from "react";
import { toast } from "sonner";
import type { WithdrawRequest } from "@/contexts/WalletContext";

const WithdrawDialog = () => {
  const { withdrawMoney, walletData } = useWallet();

  // Form state
  const [formData, setFormData] = useState<WithdrawRequest>({
    amount: 0,
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking",
    notes: "",
  });

  // Validation errors state
  const [errors, setErrors] = useState<
    Partial<Record<keyof WithdrawRequest, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateAmount = (amount: number): string | null => {
    if (!amount || amount <= 0) {
      return "Amount must be greater than 0";
    }
    if (walletData && amount > walletData.balance) {
      return "Insufficient funds";
    }
    if (amount > 999999.99) {
      return "Amount too large";
    }
    // Check for more than 2 decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
      return "Amount can have maximum 2 decimal places";
    }
    return null;
  };

  const validateAccountHolder = (name: string): string | null => {
    if (!name.trim()) {
      return "Account holder name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    if (name.trim().length > 100) {
      return "Name is too long";
    }
    // Basic name validation - letters, spaces, hyphens, apostrophes
    if (!/^[a-zA-Z\s\-'\.]+$/.test(name.trim())) {
      return "Name contains invalid characters";
    }
    return null;
  };

  const validateBankName = (bankName: string): string | null => {
    if (!bankName.trim()) {
      return "Bank name is required";
    }
    if (bankName.trim().length < 2) {
      return "Bank name must be at least 2 characters";
    }
    if (bankName.trim().length > 100) {
      return "Bank name is too long";
    }
    return null;
  };

  const validateAccountNumber = (accountNumber: string): string | null => {
    if (!accountNumber.trim()) {
      return "Account number is required";
    }
    // Remove spaces and hyphens for validation
    const cleanAccountNumber = accountNumber.replace(/[\s\-]/g, "");
    if (!/^\d+$/.test(cleanAccountNumber)) {
      return "Account number must contain only numbers";
    }
    if (cleanAccountNumber.length < 4 || cleanAccountNumber.length > 20) {
      return "Account number must be between 4 and 20 digits";
    }
    return null;
  };

  const validateRoutingNumber = (routingNumber: string): string | null => {
    if (!routingNumber.trim()) {
      return "Routing number/SWIFT code is required";
    }
    const cleanRouting = routingNumber.replace(/[\s\-]/g, "");

    // Check if it's a US routing number (9 digits) or SWIFT code (8-11 alphanumeric)
    const isUSRouting = /^\d{9}$/.test(cleanRouting);
    const isSWIFT = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i.test(cleanRouting);

    if (!isUSRouting && !isSWIFT) {
      return "Must be a valid 9-digit routing number or 8-11 character SWIFT code";
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WithdrawRequest, string>> = {};

    // Validate each field
    const amountError = validateAmount(formData.amount);
    if (amountError) newErrors.amount = amountError;

    const accountHolderError = validateAccountHolder(formData.accountHolder);
    if (accountHolderError) newErrors.accountHolder = accountHolderError;

    const bankNameError = validateBankName(formData.bankName);
    if (bankNameError) newErrors.bankName = bankNameError;

    const accountNumberError = validateAccountNumber(formData.accountNumber);
    if (accountNumberError) newErrors.accountNumber = accountNumberError;

    const routingNumberError = validateRoutingNumber(formData.routingNumber);
    if (routingNumberError) newErrors.routingNumber = routingNumberError;

    // Account type is required but handled by Select component default

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (
    field: keyof WithdrawRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (!withdrawMoney) {
      toast.error("Withdrawal service is not available");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Clean and format the data before sending
      const cleanedData: WithdrawRequest = {
        amount: Number(formData.amount),
        accountHolder: formData.accountHolder.trim(),
        bankName: formData.bankName.trim(),
        accountNumber: formData.accountNumber.replace(/[\s\-]/g, ""),
        routingNumber: formData.routingNumber
          .replace(/[\s\-]/g, "")
          .toUpperCase(),
        accountType: formData.accountType,
        notes: formData.notes?.trim() || undefined,
      };

      await withdrawMoney(cleanedData);

      // Reset form on success
      setFormData({
        amount: 0,
        accountHolder: "",
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        accountType: "checking",
        notes: "",
      });
      setErrors({});
    } catch (error) {
      // Error handling is done in the withdrawMoney function
      console.error("Withdrawal error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white bg-green-700 hover:bg-green-600">
          <FileDown /> Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">
              Withdrawal Amount
              {walletData && (
                <span className="text-sm text-gray-500 ml-2">
                  (Available: ${walletData.balance.toFixed(2)})
                </span>
              )}
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.amount || ""}
              onChange={(e) =>
                handleInputChange("amount", parseFloat(e.target.value) || 0)
              }
              className={errors.amount ? "border-red-500" : ""}
              required
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountHolder">Account Holder Name</Label>
            <Input
              id="accountHolder"
              type="text"
              placeholder="Full name as on bank account"
              value={formData.accountHolder}
              onChange={(e) =>
                handleInputChange("accountHolder", e.target.value)
              }
              className={errors.accountHolder ? "border-red-500" : ""}
              required
            />
            {errors.accountHolder && (
              <p className="text-sm text-red-500">{errors.accountHolder}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              type="text"
              placeholder="Enter your bank name"
              value={formData.bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
              className={errors.bankName ? "border-red-500" : ""}
              required
            />
            {errors.bankName && (
              <p className="text-sm text-red-500">{errors.bankName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={(e) =>
                handleInputChange("accountNumber", e.target.value)
              }
              className={errors.accountNumber ? "border-red-500" : ""}
              required
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-500">{errors.accountNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="routingNumber">Routing Number / SWIFT Code</Label>
            <Input
              id="routingNumber"
              type="text"
              placeholder="Enter routing number or SWIFT code"
              value={formData.routingNumber}
              onChange={(e) =>
                handleInputChange("routingNumber", e.target.value)
              }
              className={errors.routingNumber ? "border-red-500" : ""}
              required
            />
            {errors.routingNumber && (
              <p className="text-sm text-red-500">{errors.routingNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select
              value={formData.accountType}
              onValueChange={(value: "checking" | "savings" | "business") =>
                handleInputChange("accountType", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking Account</SelectItem>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="business">Business Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes"
              rows={2}
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              maxLength={500}
            />
            {formData.notes && (
              <p className="text-xs text-gray-500">
                {formData.notes.length}/500 characters
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 text-white bg-green-700 hover:bg-green-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Submit Withdrawal Request"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawDialog;
