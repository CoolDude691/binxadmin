import { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit2,
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const openOrders = [
  { id: "1", pair: "BTC/USDT", type: "Long", entry: "67,234.50", current: "67,450.00", size: "0.125 BTC", pnl: "+$269.44", pnlPct: "+2.1%", leverage: "10x", sl: "65,000.00", tp: "72,000.00", time: "2h 15m" },
  { id: "2", pair: "ETH/USDT", type: "Short", entry: "3,520.00", current: "3,456.78", size: "2.5 ETH", pnl: "+$158.05", pnlPct: "+1.8%", leverage: "5x", sl: "3,700.00", tp: "3,200.00", time: "45m" },
  { id: "3", pair: "SOL/USDT", type: "Long", entry: "142.50", current: "145.32", size: "15 SOL", pnl: "+$42.30", pnlPct: "+2.0%", leverage: "20x", sl: "135.00", tp: "160.00", time: "4h 30m" },
  { id: "4", pair: "EUR/USD", type: "Long", entry: "1.0850", current: "1.0892", size: "$5,000", pnl: "+$193.55", pnlPct: "+0.4%", leverage: "50x", sl: "1.0750", tp: "1.1000", time: "1d 2h" },
];

const pendingOrders = [
  { id: "5", pair: "BTC/USDT", type: "Buy Limit", price: "65,000.00", size: "0.1 BTC", value: "$6,500", created: "1h ago" },
  { id: "6", pair: "GBP/USD", type: "Sell Stop", price: "1.2650", size: "$10,000", value: "$12,650", created: "3h ago" },
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState<"open" | "pending">("open");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground mt-1">
              Manage your open positions and pending orders
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("open")}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all",
              activeTab === "open"
                ? "bg-primary text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Open Positions ({openOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all",
              activeTab === "pending"
                ? "bg-primary text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Pending Orders ({pendingOrders.length})
          </button>
        </div>

        {/* Open Positions */}
        {activeTab === "open" && (
          <GlassCard hover={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Pair</th>
                    <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Type</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Entry</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Current</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Size</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">PnL</th>
                    <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Leverage</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">SL/TP</th>
                    <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {openOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              order.type === "Long" ? "bg-accent/20" : "bg-secondary/20"
                            )}
                          >
                            {order.type === "Long" ? (
                              <TrendingUp className="w-5 h-5 text-accent" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-secondary" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold">{order.pair}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {order.time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            order.type === "Long" ? "bg-accent/20 text-accent" : "bg-secondary/20 text-secondary"
                          )}
                        >
                          {order.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono">${order.entry}</td>
                      <td className="px-4 py-4 text-right font-mono">${order.current}</td>
                      <td className="px-4 py-4 text-right font-mono text-muted-foreground">{order.size}</td>
                      <td className="px-4 py-4 text-right">
                        <div className={order.pnl.startsWith("+") ? "value-positive" : "value-negative"}>
                          <span className="font-mono font-medium">{order.pnl}</span>
                          <p className="text-xs">{order.pnlPct}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-2 py-1 rounded bg-warning/20 text-warning text-xs font-mono">
                          {order.leverage}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-xs hidden lg:table-cell">
                        <div className="text-secondary">SL: ${order.sl}</div>
                        <div className="text-accent">TP: ${order.tp}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 text-secondary transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Pending Orders */}
        {activeTab === "pending" && (
          <GlassCard hover={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Pair</th>
                    <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Type</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Trigger Price</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Size</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Value</th>
                    <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Created</th>
                    <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-4 font-semibold">{order.pair}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium">
                          {order.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono">${order.price}</td>
                      <td className="px-4 py-4 text-right font-mono">{order.size}</td>
                      <td className="px-4 py-4 text-right font-mono">{order.value}</td>
                      <td className="px-4 py-4 text-center text-muted-foreground text-sm">{order.created}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-secondary/20 hover:bg-secondary/30 text-secondary transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
