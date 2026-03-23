import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Copy,
  QrCode,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { MiniChart } from "@/components/ui/MiniChart";
import { cn } from "@/lib/utils";

const assets = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.5234", value: "$35,192.45", change: 2.45 },
  { symbol: "ETH", name: "Ethereum", balance: "4.2891", value: "$14,823.67", change: -1.23 },
  { symbol: "USDT", name: "Tether", balance: "8,450.00", value: "$8,450.00", change: 0 },
  { symbol: "SOL", name: "Solana", balance: "12.567", value: "$1,826.48", change: 5.67 },
  { symbol: "BNB", name: "BNB", balance: "2.345", value: "$1,403.35", change: 0.87 },
];

const transactions = [
  { id: "1", type: "deposit", asset: "BTC", amount: "0.125", value: "$8,404.31", status: "completed", time: "2h ago" },
  { id: "2", type: "withdraw", asset: "USDT", amount: "2,500", value: "$2,500.00", status: "pending", time: "5h ago" },
  { id: "3", type: "transfer", asset: "ETH", amount: "1.5", value: "$5,185.17", status: "completed", time: "1d ago" },
  { id: "4", type: "deposit", asset: "SOL", amount: "25", value: "$3,633.00", status: "completed", time: "2d ago" },
  { id: "5", type: "withdraw", asset: "BTC", amount: "0.05", value: "$3,361.73", status: "failed", time: "3d ago" },
];

const Wallet = () => {
  const [activeTab, setActiveTab] = useState<"spot" | "margin">("spot");
  const [showDepositModal, setShowDepositModal] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground mt-1">
              Manage your crypto and fiat assets
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors btn-glow-green"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">Deposit</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors btn-glow-red">
              <ArrowDownRight className="w-4 h-4" />
              <span className="text-sm font-medium">Withdraw</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Transfer</span>
            </button>
          </div>
        </div>

        {/* Balance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Balance"
            value="$61,695.95"
            change="+$3,245.67"
            changeType="positive"
            icon={WalletIcon}
            iconColor="primary"
          />
          <StatCard
            title="Spot Wallet"
            value="$45,231.89"
            subtitle="5 assets"
            icon={WalletIcon}
            iconColor="accent"
          />
          <StatCard
            title="Margin Wallet"
            value="$16,464.06"
            subtitle="3x leverage"
            icon={WalletIcon}
            iconColor="warning"
          />
          <StatCard
            title="24h PnL"
            value="+$1,892.34"
            change="+3.2%"
            changeType="positive"
            chart={<MiniChart data={[40, 42, 38, 45, 50, 48, 55, 60, 58, 65, 70, 75]} color="green" />}
          />
        </div>

        {/* Wallet Type Tabs */}
        <div className="flex gap-2">
          {["spot", "margin"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all capitalize",
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {tab} Wallet
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Assets List */}
          <div className="xl:col-span-2">
            <GlassCard hover={false} className="overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold">Your Assets</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Asset</th>
                      <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Balance</th>
                      <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Value</th>
                      <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">24h</th>
                      <th className="px-4 py-3 text-xs text-muted-foreground font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset, index) => (
                      <motion.tr
                        key={asset.symbol}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <span className="text-xs font-bold text-white">{asset.symbol}</span>
                            </div>
                            <div>
                              <span className="font-semibold">{asset.symbol}</span>
                              <p className="text-xs text-muted-foreground">{asset.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-mono">{asset.balance}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-mono font-medium">{asset.value}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span
                            className={cn(
                              "font-mono",
                              asset.change > 0 ? "value-positive" : asset.change < 0 ? "value-negative" : "text-muted-foreground"
                            )}
                          >
                            {asset.change > 0 ? "+" : ""}{asset.change}%
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="px-3 py-1.5 text-xs rounded bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground transition-colors">
                              Deposit
                            </button>
                            <button className="px-3 py-1.5 text-xs rounded bg-secondary/20 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors">
                              Withdraw
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Quick Deposit & Transactions */}
          <div className="space-y-6">
            {/* Quick Deposit */}
            <GlassCard hover={false} className="p-4">
              <h3 className="font-semibold mb-4">Quick Deposit</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Select Asset</label>
                  <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">BTC</span>
                      </div>
                      <span>Bitcoin</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Deposit Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                      readOnly
                      className="w-full px-3 py-2.5 pr-20 rounded-lg bg-muted/50 border border-border/50 font-mono text-xs"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button className="p-1.5 rounded bg-muted hover:bg-muted/80 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded bg-muted hover:bg-muted/80 transition-colors">
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                  <p className="text-xs text-warning">
                    Only send BTC to this address. Sending any other asset may result in permanent loss.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Recent Transactions */}
            <GlassCard hover={false} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Transactions</h3>
                <button className="text-sm text-primary hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 4).map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          tx.type === "deposit" && "bg-accent/20",
                          tx.type === "withdraw" && "bg-secondary/20",
                          tx.type === "transfer" && "bg-primary/20"
                        )}
                      >
                        {tx.type === "deposit" ? (
                          <ArrowUpRight className="w-4 h-4 text-accent" />
                        ) : tx.type === "withdraw" ? (
                          <ArrowDownRight className="w-4 h-4 text-secondary" />
                        ) : (
                          <RefreshCw className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{tx.type}</span>
                          <span className="text-xs text-muted-foreground">{tx.asset}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {tx.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm">{tx.value}</span>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {tx.status === "completed" ? (
                          <CheckCircle className="w-3 h-3 text-accent" />
                        ) : tx.status === "pending" ? (
                          <Clock className="w-3 h-3 text-warning" />
                        ) : (
                          <XCircle className="w-3 h-3 text-secondary" />
                        )}
                        <span
                          className={cn(
                            "text-xs capitalize",
                            tx.status === "completed" && "text-accent",
                            tx.status === "pending" && "text-warning",
                            tx.status === "failed" && "text-secondary"
                          )}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
