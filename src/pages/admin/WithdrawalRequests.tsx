import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye, Clock, DollarSign, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type WithdrawalRequest = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  paymentMethod: string;
  walletAddress?: string;
  requestDate: string;
};

const WithdrawalRequests = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  const fetchWithdrawals = async () => {
    const res = await fetch("https://api.binxtrade.in/adminapi/get-withdrawals.php");
    const json = await res.json();
    if (json.status) {
      setWithdrawals(
        json.data.map((w: any) => ({
          id: w.id,
          userId: w.user_id,
          userName: w.full_name,
          email: w.email,
          amount: Number(w.total_amount),
          status: w.status,
          paymentMethod: w.currency,
          walletAddress: w.wallet_address ?? "",
          requestDate: w.created_at,
        }))
      );
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async () => {
    if (!selectedRequest) return;

    await fetch("https://api.binxtrade.in/adminapi/update-withdrawal-status.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "id=" +
        selectedRequest.id +
        "&status=" +
        (actionType === "approve" ? "approved" : "rejected"),
    });

    setIsActionDialogOpen(false);
    setSelectedRequest(null);
    fetchWithdrawals();
  };

  const pendingCount = withdrawals.filter(w => w.status === "pending").length;
  const pendingAmount = withdrawals.filter(w => w.status === "pending").reduce((s, w) => s + w.amount, 0);
  const approvedAmount = withdrawals.filter(w => w.status === "approved").reduce((s, w) => s + w.amount, 0);

  const columns = [
    { key: "id", label: "Request ID", sortable: true },
    { key: "userId", label: "User ID", sortable: true },
    { key: "userName", label: "User Name", sortable: true },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (req: WithdrawalRequest) => (
        <span className="font-mono-trading font-semibold">{formatCurrency(req.amount)}</span>
      ),
    },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (req: WithdrawalRequest) => (
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
          req.status === "approved" && "bg-accent/20 text-accent",
          req.status === "rejected" && "bg-secondary/20 text-secondary",
          req.status === "pending" && "bg-warning/20 text-warning"
        )}>
          {req.status === "pending" && <Clock className="w-3 h-3" />}
          {req.status === "approved" && <CheckCircle className="w-3 h-3" />}
          {req.status === "rejected" && <XCircle className="w-3 h-3" />}
          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
        </span>
      ),
    },
    { key: "requestDate", label: "Request Date", sortable: true },
  ];

  const actions = (req: WithdrawalRequest) => (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedRequest(req);
          setIsViewDialogOpen(true);
        }}
        className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>
      {req.status === "pending" && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRequest(req);
              setActionType("approve");
              setIsActionDialogOpen(true);
            }}
            className="p-1.5 rounded hover:bg-accent/20 text-accent transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRequest(req);
              setActionType("reject");
              setIsActionDialogOpen(true);
            }}
            className="p-1.5 rounded hover:bg-secondary/20 text-secondary transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Withdrawal Requests</h1>
          <p className="text-muted-foreground mt-1">Manage and process withdrawal requests</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold font-mono-trading text-warning">
                  {formatCurrency(pendingAmount)}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Approved</p>
                <p className="text-2xl font-bold font-mono-trading text-accent">
                  {formatCurrency(approvedAmount)}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <DataTable
          data={withdrawals}
          columns={columns}
          actions={actions}
          searchKeys={["id", "userId", "userName", "paymentMethod"]}
          searchPlaceholder="Search withdrawals..."
        />

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="glass-card border-border/50 max-w-md">
            <DialogHeader>
              <DialogTitle>Withdrawal Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Request ID</p>
                    <p className="font-medium">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User</p>
                    <p className="font-medium">{selectedRequest.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium font-mono-trading text-lg">
                      {formatCurrency(selectedRequest.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      selectedRequest.status === "approved" && "bg-accent/20 text-accent",
                      selectedRequest.status === "rejected" && "bg-secondary/20 text-secondary",
                      selectedRequest.status === "pending" && "bg-warning/20 text-warning"
                    )}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{selectedRequest.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p className="font-medium">{selectedRequest.requestDate}</p>
                  </div>
                  {selectedRequest.walletAddress && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Wallet/Account</p>
                      <p className="font-medium font-mono text-sm">
                        {selectedRequest.walletAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent className="glass-card border-border/50 max-w-sm">
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Are you sure you want to {actionType} this withdrawal request of{" "}
              <strong className="font-mono-trading">
                {formatCurrency(selectedRequest?.amount || 0)}
              </strong>{" "}
              for <strong>{selectedRequest?.userName}</strong>?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                className={actionType === "approve"
                  ? "bg-accent hover:bg-accent/90"
                  : "bg-secondary hover:bg-secondary/90"}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default WithdrawalRequests;
