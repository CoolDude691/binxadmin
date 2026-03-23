import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Users,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { TradingChart } from "@/components/ui/TradingChart";
import { MiniChart } from "@/components/ui/MiniChart";
import { MarketTable } from "@/components/trading/MarketTable";
import { Link } from "react-router-dom";

const recentOrders = [
  { id: "1", pair: "BTC/USDT", type: "Buy", amount: "0.025", price: "67,234.50", status: "Filled", time: "2m ago" },
  { id: "2", pair: "ETH/USDT", type: "Sell", amount: "1.5", price: "3,456.78", status: "Pending", time: "5m ago" },
  { id: "3", pair: "SOL/USDT", type: "Buy", amount: "10", price: "145.32", status: "Filled", time: "15m ago" },
  { id: "4", pair: "EUR/USD", type: "Sell", amount: "1,000", price: "1.0892", status: "Filled", time: "30m ago" },
];

const marketMovers = [
  { symbol: "SOL", name: "Solana", change: 5.67, price: "145.32" },
  { symbol: "AVAX", name: "Avalanche", change: 4.23, price: "38.45" },
  { symbol: "DOGE", name: "Dogecoin", change: -3.21, price: "0.0834" },
  { symbol: "MATIC", name: "Polygon", change: -2.45, price: "0.567" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, John!</h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your portfolio today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/wallet"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Deposit</span>
            </Link>
            <Link
              to="/trade"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors btn-glow"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Trade Now</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Balance"
            value="$45,231.89"
            change="+$1,234.56"
            changeType="positive"
            icon={Wallet}
            iconColor="primary"
            chart={<MiniChart data={[30, 35, 40, 38, 45, 50, 48, 55, 52, 60, 58, 65]} color="blue" />}
          />
          <StatCard
            title="Available Margin"
            value="$12,450.00"
            subtitle="Used: $8,550.00"
            icon={DollarSign}
            iconColor="accent"
          />
          <StatCard
            title="Open Trades"
            value="8"
            change="+3 today"
            changeType="neutral"
            icon={Activity}
            iconColor="warning"
          />
          <StatCard
            title="Today's PnL"
            value="+$2,870.65"
            change="+6.3%"
            changeType="positive"
            icon={BarChart3}
            iconColor="accent"
            chart={<MiniChart data={[40, 42, 38, 45, 50, 48, 55, 60, 58, 65, 70, 75]} color="green" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="xl:col-span-2 space-y-6">
            <TradingChart title="Portfolio Equity" height={350} />

            {/* Recent Orders */}
            <GlassCard hover={false} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Orders</h3>
                <Link to="/orders" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left pb-3 text-xs text-muted-foreground font-medium">Pair</th>
                      <th className="text-left pb-3 text-xs text-muted-foreground font-medium">Type</th>
                      <th className="text-right pb-3 text-xs text-muted-foreground font-medium">Amount</th>
                      <th className="text-right pb-3 text-xs text-muted-foreground font-medium">Price</th>
                      <th className="text-center pb-3 text-xs text-muted-foreground font-medium">Status</th>
                      <th className="text-right pb-3 text-xs text-muted-foreground font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-border/30 last:border-0"
                      >
                        <td className="py-3 font-medium">{order.pair}</td>
                        <td className="py-3">
                          <span
                            className={`flex items-center gap-1 ${
                              order.type === "Buy" ? "text-accent" : "text-secondary"
                            }`}
                          >
                            {order.type === "Buy" ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            {order.type}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono">{order.amount}</td>
                        <td className="py-3 text-right font-mono">${order.price}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Filled"
                                ? "bg-accent/20 text-accent"
                                : "bg-warning/20 text-warning"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-muted-foreground text-sm">
                          <div className="flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" />
                            {order.time}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <GlassCard hover={false} className="p-4">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Deposit", icon: ArrowUpRight, color: "accent" },
                  { label: "Withdraw", icon: ArrowDownRight, color: "secondary" },
                  { label: "Transfer", icon: Activity, color: "primary" },
                  { label: "History", icon: Clock, color: "warning" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all group"
                  >
                    <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Market Movers */}
            <GlassCard hover={false} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Market Movers</h3>
                <Link to="/markets" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {marketMovers.map((mover, index) => (
                  <motion.div
                    key={mover.symbol}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                        <span className="text-xs font-bold">{mover.symbol}</span>
                      </div>
                      <div>
                        <span className="font-medium">{mover.symbol}</span>
                        <p className="text-xs text-muted-foreground">{mover.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono">${mover.price}</span>
                      <p
                        className={`text-sm font-mono ${
                          mover.change >= 0 ? "value-positive" : "value-negative"
                        }`}
                      >
                        {mover.change >= 0 ? "+" : ""}{mover.change}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Portfolio Distribution */}
            <GlassCard hover={false} className="p-4">
              <h3 className="font-semibold mb-4">Portfolio Distribution</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      className="fill-none stroke-muted/30"
                      strokeWidth="3"
                      r="16"
                      cx="18"
                      cy="18"
                    />
                    <circle
                      className="fill-none stroke-primary"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="45, 100"
                      r="16"
                      cx="18"
                      cy="18"
                    />
                    <circle
                      className="fill-none stroke-accent"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="25, 100"
                      strokeDashoffset="-45"
                      r="16"
                      cx="18"
                      cy="18"
                    />
                    <circle
                      className="fill-none stroke-warning"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="20, 100"
                      strokeDashoffset="-70"
                      r="16"
                      cx="18"
                      cy="18"
                    />
                    <circle
                      className="fill-none stroke-secondary"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="10, 100"
                      strokeDashoffset="-90"
                      r="16"
                      cx="18"
                      cy="18"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PieChart className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "BTC", value: "45%", color: "bg-primary" },
                  { label: "ETH", value: "25%", color: "bg-accent" },
                  { label: "SOL", value: "20%", color: "bg-warning" },
                  { label: "Others", value: "10%", color: "bg-secondary" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Market Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          <MarketTable type="crypto" compact />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
