import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Ban, CheckCircle } from "lucide-react";
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

type Wallet = {
  id: string;
  currency_code: string;
  currency_name: string;
  network: string;
  address: string;
  balance: number;
  created_at: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "blocked";
  balance: number;
  referralCode: string;
  createdAt: string;
  wallets: Wallet[];
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    fetch("https://api.binxtrade.in/adminapi/get_all_users.php")
      .then((res) => res.json())
      .then((response) => {
        if (!response.status) {
          console.error("API Error:", response);
          return;
        }

        const mapped = response.data.map((u: any) => ({
          id: String(u.id),
          name: u.full_name || "",
          email: u.email || "",
          phone: u.mobile || "",
          status: u.status === "1" ? "active" : "blocked",
          balance: Number(u.balance || 0),
          referralCode: u.referal || "",
          createdAt: u.created_at || "",
          wallets: u.wallets || [],
        }));

        setUsers(mapped);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
      });
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const handleEditUser = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, ...editForm } : u
      )
    );
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setEditForm({});
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = (user: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  const columns = [
    { key: "id", label: "User ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone" },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (u: User) => (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
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
        <span className="font-mono">{formatCurrency(u.balance)}</span>
      ),
    },
    { key: "referralCode", label: "Referral" },
    { key: "createdAt", label: "Created", sortable: true },
  ];

  const actions = (user: User) => (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={() => {
          setSelectedUser(user);
          setIsViewDialogOpen(true);
        }}
        className="p-1.5 rounded hover:bg-muted/50"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          setSelectedUser(user);
          setEditForm(user);
          setIsEditDialogOpen(true);
        }}
        className="p-1.5 rounded hover:bg-muted/50"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleToggleStatus(user)}
        className={cn(
          "p-1.5 rounded",
          user.status === "active"
            ? "text-secondary"
            : "text-accent"
        )}
      >
        {user.status === "active" ? (
          <Ban className="w-4 h-4" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
      </button>
      <button
        onClick={() => {
          setSelectedUser(user);
          setIsDeleteDialogOpen(true);
        }}
        className="p-1.5 rounded text-secondary"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">All registered users</p>
          </div>
          <Button className="btn-glow">
            <Plus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </GlassCard>
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-accent">
              {users.filter((u) => u.status === "active").length}
            </p>
          </GlassCard>
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground">Blocked</p>
            <p className="text-2xl font-bold text-secondary">
              {users.filter((u) => u.status === "blocked").length}
            </p>
          </GlassCard>
          <GlassCard className="p-4">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-2xl font-bold font-mono">
              {formatCurrency(
                users.reduce((s, u) => s + u.balance, 0)
              )}
            </p>
          </GlassCard>
        </div>

        <DataTable
          data={users}
          columns={columns}
          actions={actions}
          searchKeys={["id", "name", "email", "phone"]}
          searchPlaceholder="Search users..."
        />

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            {selectedUser && (
              <div className="space-y-6">

                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <p className="text-muted-foreground">{selectedUser.phone}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Crypto Wallets</h4>

                  {selectedUser.wallets.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No wallets added.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {selectedUser.wallets.map((wallet) => (
                        <div
                          key={wallet.id}
                          className="p-4 rounded-xl border border-border bg-muted/10"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">
                              {wallet.currency_name} ({wallet.currency_code})
                            </span>
                            <span className="text-accent font-mono">
                              {formatCurrency(Number(wallet.balance))}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground break-all">
                            {wallet.address}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            Network: {wallet.network}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            Added: {wallet.created_at}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <input
              className="w-full p-2 border rounded"
              value={editForm.name || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
            <DialogFooter>
              <Button onClick={handleEditUser}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <p>
              Delete <strong>{selectedUser?.name}</strong>?
            </p>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
