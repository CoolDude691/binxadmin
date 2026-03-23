import { useEffect, useState } from "react";
import { Plus, Minus, History, Wallet } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "blocked";
  balance: number;
};

type BalanceHistory = {
  id: string;
  type: "add" | "deduct";
  amount: number;
  reason: string;
  created_at: string;
  admin_name: string;
};

const UserWallets = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [history, setHistory] = useState<BalanceHistory[]>([]);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [adjustType, setAdjustType] = useState<"add" | "deduct">("add");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetch("https://api.binxtrade.in/adminapi/get_all_users.php")
      .then((r) => r.json())
      .then((res) =>
        setUsers(
          res.data.map((u: any) => ({
            id: u.id,
            name: u.full_name,
            email: u.email,
            status: u.status === "1" ? "active" : "blocked",
            balance: Number(u.balance),
          }))
        )
      );
  }, []);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(v);

  const adjustBalance = () => {
    if (!selectedUser || !amount) return;

    fetch("https://api.binxtrade.in/adminapi/update_user_balance.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selectedUser.id,
        type: adjustType,
        amount,
        reason,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? {
                  ...u,
                  balance:
                    adjustType === "add"
                      ? u.balance + Number(amount)
                      : Math.max(0, u.balance - Number(amount)),
                }
              : u
          )
        );
        setIsAdjustOpen(false);
        setAmount("");
        setReason("");
      });
  };

  const loadHistory = (user: User) => {
    setSelectedUser(user);
    fetch(
      `https://api.binxtrade.in/adminapi/get_balance_history.php?user_id=${user.id}`
    )
      .then((r) => r.json())
      .then((res) => setHistory(res.data))
      .then(() => setIsHistoryOpen(true));
  };

  const columns = [
    { key: "id", label: "User ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (u: User) => (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs",
            u.status === "active"
              ? "bg-accent/20 text-accent"
              : "bg-secondary/20 text-secondary"
          )}
        >
          {u.status}
        </span>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      sortable: true,
      render: (u: User) => (
        <span className="font-mono text-accent">
          {formatCurrency(u.balance)}
        </span>
      ),
    },
  ];

  const actions = (u: User) => (
    <div className="flex gap-2 justify-end">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setSelectedUser(u);
          setAdjustType("add");
          setIsAdjustOpen(true);
        }}
        className="text-accent"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setSelectedUser(u);
          setAdjustType("deduct");
          setIsAdjustOpen(true);
        }}
        className="text-secondary"
      >
        <Minus className="w-4 h-4 mr-1" />
        Deduct
      </Button>
      <Button size="sm" variant="ghost" onClick={() => loadHistory(u)}>
        <History className="w-4 h-4" />
      </Button>
    </div>
  );

  const totalBalance = users.reduce((s, u) => s + u.balance, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">User Wallets</h1>
          <p className="text-muted-foreground">
            Wallet balances and manual adjustments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Platform Balance
                </p>
                <p className="text-2xl font-bold font-mono">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <DataTable
          data={users}
          columns={columns}
          actions={actions}
          searchKeys={["id", "name", "email"]}
          searchPlaceholder="Search users..."
        />

        <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {adjustType === "add" ? "Add Balance" : "Deduct Balance"}
              </DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <p className="font-medium">{selectedUser.name}</p>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Amount"
                />
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Reason"
                />
              </div>
            )}
            <DialogFooter>
              <Button onClick={adjustBalance}>
                {adjustType === "add" ? "Add" : "Deduct"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Balance History - {selectedUser?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="flex justify-between p-3 rounded bg-muted/30"
                >
                  <div>
                    <p className="text-sm">{h.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {h.created_at} by {h.admin_name}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "font-mono",
                      h.type === "add"
                        ? "text-accent"
                        : "text-secondary"
                    )}
                  >
                    {h.type === "add" ? "+" : "-"}
                    {formatCurrency(h.amount)}
                  </span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UserWallets;
