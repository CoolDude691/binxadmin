import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye, Clock, DollarSign, ArrowUpFromLine } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type DepositRequest = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  paymentMethod: string;
  transactionId: string;
  requestDate: string;
};

const DepositRequests = () => {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  const fetchDeposits = async () => {
    const res = await fetch("https://api.binxtrade.in/adminapi/get-deposits.php");
    const json = await res.json();
    if (json.status) {
      setDeposits(
        json.data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          userName: d.full_name,
          email: d.email,
          amount: Number(d.total_amount),
          status: d.status,
          paymentMethod: d.currency,
          transactionId: d.id,
          requestDate: d.created_at,
        }))
      );
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleAction = async () => {
    if (!selectedRequest) return;

    await fetch("https://api.binxtrade.in/adminapi/update-deposit-status.php", {
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
    fetchDeposits();
  };

  const pendingCount = deposits.filter(d => d.status === "pending").length;
  const pendingAmount = deposits.filter(d => d.status === "pending").reduce((sum, d) => sum + d.amount, 0);
  const approvedAmount = deposits.filter(d => d.status === "approved").reduce((sum, d) => sum + d.amount, 0);

  const columns = [
    { key: "id", label: "Deposit ID", sortable: true },
    { key: "userId", label: "User ID", sortable: true },
    { key: "userName", label: "User Name", sortable: true },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (req: DepositRequest) => (
        <span className="font-mono-trading font-semibold text-accent">
          {formatCurrency(req.amount)}
        </span>
      ),
    },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "transactionId", label: "Transaction ID" },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (req: DepositRequest) => (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1",
            req.status === "approved" && "bg-accent/20 text-accent",
            req.status === "rejected" && "bg-secondary/20 text-secondary",
            req.status === "pending" && "bg-warning/20 text-warning"
          )}
        >
          {req.status === "pending" && <Clock className="w-3 h-3" />}
          {req.status === "approved" && <CheckCircle className="w-3 h-3" />}
          {req.status === "rejected" && <XCircle className="w-3 h-3" />}
          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
        </span>
      ),
    },
    { key: "requestDate", label: "Date", sortable: true },
  ];

  const actions = (req: DepositRequest) => (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedRequest(req);
          setIsViewDialogOpen(true);
        }}
        className="p-1.5 rounded hover:bg-muted/50"
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
          >
            <CheckCircle className="w-4 h-4 text-accent" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRequest(req);
              setActionType("reject");
              setIsActionDialogOpen(true);
            }}
          >
            <XCircle className="w-4 h-4 text-secondary" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Top-Up / Deposit Requests</h1>
          <p className="text-muted-foreground mt-1">Review and approve deposit requests</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-5">
            <Clock /> {pendingCount}
          </GlassCard>
          <GlassCard className="p-5">
            <ArrowUpFromLine /> {formatCurrency(pendingAmount)}
          </GlassCard>
          <GlassCard className="p-5">
            <DollarSign /> {formatCurrency(approvedAmount)}
          </GlassCard>
        </div>

        <DataTable
          data={deposits}
          columns={columns}
          actions={actions}
          searchKeys={["id", "userId", "userName", "transactionId", "paymentMethod"]}
          searchPlaceholder="Search deposits..."
        />

        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Approve Deposit" : "Reject Deposit"}
              </DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleAction}>
                {actionType === "approve" ? "Approve" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default DepositRequests;
