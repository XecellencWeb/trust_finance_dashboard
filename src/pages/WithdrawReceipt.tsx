import { useWallet } from "@/contexts/WalletContext";
import { CheckCircle, Clock, XCircle, Download, Printer } from "lucide-react";
import { useParams } from "react-router-dom";

const WithdrawReceipt = () => {
  const { getWithdrawRequest } = useWallet();
  const { id } = useParams();
  const { data }: any = getWithdrawRequest(id);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading withdrawal details...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text receipt for download
    const receiptText = `
WITHDRAWAL RECEIPT
==================
Transaction ID: ${data._id}
Amount: ${formatAmount(data.amount)}
Status: ${data.status.toUpperCase()}
Date: ${formatDate(data.createdAt)}

ACCOUNT DETAILS
===============
Account Holder: ${data.accountHolder}
Bank Name: ${data.bankName}
Account Number: ${"*".repeat(
      data.accountNumber.length - 4
    )}${data.accountNumber.slice(-4)}
Routing Number: ${data.routingNumber}
Account Type: ${
      data.accountType.charAt(0).toUpperCase() + data.accountType.slice(1)
    }

Thank you for using our service.
    `;

    const blob = new Blob([receiptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `withdrawal-receipt-${data._id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Withdrawal Receipt
          </h1>
          <p className="text-gray-600">
            Transaction completed on {formatDate(data.createdAt)}
          </p>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 py-4 ${getStatusColor(data.status)} border-b`}>
            <div className="flex items-center justify-center space-x-2">
              {getStatusIcon(data.status)}
              <span className="font-semibold capitalize">
                {data.status} Withdrawal
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Amount Section */}
            <div className="text-center border-b pb-6">
              <p className="text-sm text-gray-500 mb-1">Withdrawal Amount</p>
              <p className="text-4xl font-bold text-gray-900">
                {formatAmount(data.amount)}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Transaction Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-mono text-sm text-gray-900 break-all">
                      {data._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(data.status)}
                      <span className="capitalize font-medium">
                        {data.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="text-gray-900">
                      {formatDate(data.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Account Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Account Holder</p>
                    <p className="text-gray-900 font-medium">
                      {data.accountHolder}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Bank Name</p>
                    <p className="text-gray-900">{data.bankName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-mono text-gray-900">
                      {"*".repeat(data.accountNumber.length - 4)}
                      {data.accountNumber.slice(-4)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Routing Number</p>
                    <p className="font-mono text-gray-900">
                      {data.routingNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="text-gray-900 capitalize">
                      {data.accountType}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                {data.status === "pending" && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Processing Your Withdrawal
                    </h4>
                    <p className="text-sm text-gray-600">
                      Your withdrawal request is being processed. You will
                      receive an email notification once the transfer is
                      complete. Processing typically takes 1-3 business days.
                    </p>
                  </div>
                )}

                {data.status === "completed" && (
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">
                      Withdrawal Completed
                    </h4>
                    <p className="text-sm text-gray-600">
                      Your withdrawal has been successfully processed and the
                      funds have been transferred to your account.
                    </p>
                  </div>
                )}

                {data.status === "failed" && (
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">
                      Withdrawal Failed
                    </h4>
                    <p className="text-sm text-gray-600">
                      There was an issue processing your withdrawal. Please
                      contact support for assistance.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t">
              <p className="text-xs text-gray-500">
                Keep this receipt for your records. If you have any questions
                about this transaction, please contact our support team with
                your transaction ID.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawReceipt;
