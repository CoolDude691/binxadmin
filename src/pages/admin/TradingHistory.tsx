import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Filter,
  Calendar,
  Download,
  BarChart3,
} from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type TradeHistory = {
  trade_id: string;
  trade_type: "UP" | "DOWN";
  base_amount: string;
  quantity: string;
  multiplier: string;
  total_amount: string;
  duration: string;
  entry_price: string;
  exit_price: string;
  status: string;
  profit: string;
  expiry_time: string;
  trade_time: string;
  user_id: string;
  full_name: string;
  email: string;
  mobile: string;
};

type DateRange = "today" | "week" | "month" | "all";

const TradingHistory = () => {
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch("https://api.binxtrade.in/adminapi/get_user_trade_history.php")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API DATA:", data);
        if (data.error) {
          console.error("API Error:", data.error);
          return;
        }
        setTrades(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getFilteredTradesByDate = (trades: TradeHistory[], range: DateRange) => {
    const now = new Date();

    switch (range) {
      case "today":
        const today = formatDate(now);
        return trades.filter(t =>
          t.trade_time && formatDate(new Date(t.trade_time)) === today
        );

      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return trades.filter(t =>
          t.trade_time && new Date(t.trade_time) >= weekAgo
        );

      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return trades.filter(t =>
          t.trade_time && new Date(t.trade_time) >= monthAgo
        );

      default:
        return trades;
    }
  };

  const users = [...new Set(trades.map((t) => t.full_name))];

  const dateFilteredTrades = getFilteredTradesByDate(trades, dateRange);

  const filteredTrades = dateFilteredTrades.filter((t) => {
    if (filterUser !== "all" && t.full_name !== filterUser) return false;
    if (filterType !== "all" && t.trade_type !== filterType) return false;
    return true;
  });

  // Calculate metrics for filtered trades
  const totalVolume = filteredTrades.reduce(
    (sum, t) => sum + Number(t.total_amount),
    0
  );

  const totalBets = filteredTrades.length;

  // CORRECTED: Calculate win/loss stats using profit field
  const winTrades = filteredTrades.filter(t => t.status === "win" || t.status === "WIN");
  const lossTrades = filteredTrades.filter(t => t.status === "loss" || t.status === "LOSS");

  // CORRECTED: Use the profit field directly for win trades (positive profit)
  const winAmount = winTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);

  // CORRECTED: Use the profit field for loss trades (negative profit or positive loss amount)
  const lossAmount = lossTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);

  const totalWinTrades = winTrades.length;
  const totalLossTrades = lossTrades.length;

  // CORRECTED: Company profit calculation - For win trades, profit goes to user (company loses)
  // For loss trades, profit goes to company (company gains)
  const companyProfit = lossAmount - winAmount;

  // Today's specific calculations
  const todayTrades = getFilteredTradesByDate(trades, "today");
  const todayTotalBets = todayTrades.length;
  const todayVolume = todayTrades.reduce((sum, t) => sum + Number(t.total_amount), 0);
  const todayWinTrades = todayTrades.filter(t => t.status === "win" || t.status === "WIN");
  const todayLossTrades = todayTrades.filter(t => t.status === "loss" || t.status === "LOSS");
  const todayWinAmount = todayWinTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);
  const todayLossAmount = todayLossTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);
  const todayCompanyProfit = todayLossAmount - todayWinAmount;

  // Weekly calculations
  const weekTrades = getFilteredTradesByDate(trades, "week");
  const weekTotalBets = weekTrades.length;
  const weekVolume = weekTrades.reduce((sum, t) => sum + Number(t.total_amount), 0);
  const weekWinTrades = weekTrades.filter(t => t.status === "win" || t.status === "WIN");
  const weekLossTrades = weekTrades.filter(t => t.status === "loss" || t.status === "LOSS");
  const weekWinAmount = weekWinTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);
  const weekLossAmount = weekLossTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);
  const weekCompanyProfit = weekLossAmount - weekWinAmount;

  // Monthly calculations
  const monthTrades = getFilteredTradesByDate(trades, "month");
  const monthTotalBets = monthTrades.length;
  const monthVolume = monthTrades.reduce((sum, t) => sum + Number(t.total_amount), 0);
  const monthWinTrades = monthTrades.filter(t => t.status === "win" || t.status === "WIN");
  const monthLossTrades = monthTrades.filter(t => t.status === "loss" || t.status === "LOSS");
  const monthWinAmount = monthWinTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);
  const monthLossAmount = monthLossTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);
  const monthCompanyProfit = monthLossAmount - monthWinAmount;

  // Generate report data
  const generateReport = () => {
    const report = {
      overall: {
        totalBets: trades.length,
        totalVolume: trades.reduce((sum, t) => sum + Number(t.total_amount), 0),
        winBets: trades.filter(t => t.status === "win" || t.status === "WIN").length,
        lossBets: trades.filter(t => t.status === "loss" || t.status === "LOSS").length,
        winAmount: trades.filter(t => t.status === "win" || t.status === "WIN")
          .reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0),
        lossAmount: trades.filter(t => t.status === "loss" || t.status === "LOSS")
          .reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0),
        companyProfit: trades.filter(t => t.status === "loss" || t.status === "LOSS")
          .reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0) -
          trades.filter(t => t.status === "win" || t.status === "WIN")
            .reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0)
      },
      today: {
        totalBets: todayTotalBets,
        totalVolume: todayVolume,
        winBets: todayWinTrades.length,
        lossBets: todayLossTrades.length,
        winAmount: todayWinAmount,
        lossAmount: todayLossAmount,
        companyProfit: todayCompanyProfit
      },
      weekly: {
        totalBets: weekTotalBets,
        totalVolume: weekVolume,
        winBets: weekWinTrades.length,
        lossBets: weekLossTrades.length,
        winAmount: weekWinAmount,
        lossAmount: weekLossAmount,
        companyProfit: weekCompanyProfit
      },
      monthly: {
        totalBets: monthTotalBets,
        totalVolume: monthVolume,
        winBets: monthWinTrades.length,
        lossBets: monthLossTrades.length,
        winAmount: monthWinAmount,
        lossAmount: monthLossAmount,
        companyProfit: monthCompanyProfit
      },
      userStats: users.map(user => {
        const userTrades = trades.filter(t => t.full_name === user);
        const userWinTrades = userTrades.filter(t => t.status === "win" || t.status === "WIN");
        const userLossTrades = userTrades.filter(t => t.status === "loss" || t.status === "LOSS");
        const userWinAmount = userWinTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);
        const userLossAmount = userLossTrades.reduce((sum, t) => sum + Math.abs(Number(t.profit) || 0), 0);

        return {
          userName: user,
          totalBets: userTrades.length,
          totalVolume: userTrades.reduce((sum, t) => sum + Number(t.total_amount), 0),
          winBets: userWinTrades.length,
          lossBets: userLossTrades.length,
          winAmount: userWinAmount,
          lossAmount: userLossAmount,
          winRate: userTrades.length > 0 ? (userWinTrades.length / userTrades.length * 100).toFixed(2) : "0",
          netProfit: userWinAmount - userLossAmount, // User's perspective
          companyProfitFromUser: userLossAmount - userWinAmount // Company's perspective
        };
      })
    };

    // Download as JSON
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trading-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    { key: "trade_id", label: "Trade ID", sortable: true },
    { key: "user_id", label: "User ID", sortable: true },
    { key: "full_name", label: "User Name", sortable: true },
    {
      key: "trade_type",
      label: "Type",
      sortable: true,
      render: (t: TradeHistory) => (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1",
            t.trade_type === "UP"
              ? "bg-accent/20 text-accent"
              : "bg-secondary/20 text-secondary"
          )}
        >
          {t.trade_type === "UP" ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {t.trade_type === "UP" ? "BUY" : "SELL"}
        </span>
      ),
    },
    {
      key: "total_amount",
      label: "Amount",
      sortable: true,
      render: (t: TradeHistory) => (
        <span className="font-mono">
          {formatCurrency(Number(t.total_amount))}
        </span>
      ),
    },
    {
      key: "multiplier",
      label: "Leverage",
      sortable: true,
      render: (t: TradeHistory) => (
        <span className="font-mono">{t.multiplier}x</span>
      ),
    },
    {
      key: "profit",
      label: "P&L",
      sortable: true,
      render: (t: TradeHistory) => {
        const profitValue = Number(t.profit || 0);
        const isWin = t.status === "win" || t.status === "WIN";
        const isLoss = t.status === "loss" || t.status === "LOSS";

        return (
          <span className={cn(
            "font-mono font-semibold",
            isWin ? "text-green-600" : isLoss ? "text-red-600" : "text-gray-600"
          )}>
            {isWin ? "+" : isLoss ? "-" : ""}{formatCurrency(Math.abs(profitValue))}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (t: TradeHistory) => {
        const isWin = t.status === "win" || t.status === "WIN";
        const isLoss = t.status === "loss" || t.status === "LOSS";

        return (
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-semibold",
              isWin
                ? "bg-green-500/20 text-green-600"
                : isLoss
                  ? "bg-red-500/20 text-red-600"
                  : "bg-yellow-500/20 text-yellow-600"
            )}
          >
            {isWin ? "WIN" : isLoss ? "LOSS" : t.status?.toUpperCase() || "PENDING"}
          </span>
        );
      },
    },
    {
      key: "trade_time",
      label: "Date & Time",
      sortable: true,
      render: (t: TradeHistory) =>
        t.trade_time ? new Date(t.trade_time).toLocaleString() : "N/A",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Trading History</h1>
            <p className="text-muted-foreground mt-1">
              Live trading activity across all users
            </p>
          </div>
          <Button
            onClick={generateReport}
            className="gap-2"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            Download Full Report
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="today">Today's Stats</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <GlassCard className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                    <p className="text-2xl font-bold">{totalBets}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                    <p className="text-2xl font-bold font-mono">
                      {formatCurrency(totalVolume)}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Win Amount</p>
                    <p className="text-2xl font-bold text-green-600 font-mono">
                      {formatCurrency(winAmount)}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loss Amount</p>
                    <p className="text-2xl font-bold text-red-600 font-mono">
                      {formatCurrency(lossAmount)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company Profit</p>
                    <p className={cn(
                      "text-2xl font-bold font-mono",
                      companyProfit >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(companyProfit)}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">
                    {totalBets > 0 ? ((totalWinTrades / totalBets) * 100).toFixed(2) : "0"}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalWinTrades} Wins / {totalLossTrades} Losses
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg. Bet Size</p>
                  <p className="text-2xl font-bold font-mono">
                    {totalBets > 0 ? formatCurrency(totalVolume / totalBets) : formatCurrency(0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total {totalBets} bets
                  </p>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="today" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard className="p-5">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Today's Bets</p>
                  <p className="text-2xl font-bold">{todayTotalBets}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Volume: {formatCurrency(todayVolume)}</p>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Today's Win Amount</p>
                  <p className="text-2xl font-bold text-green-600 font-mono">{formatCurrency(todayWinAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{todayWinTrades.length} winning trades</p>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Today's Loss Amount</p>
                  <p className="text-2xl font-bold text-red-600 font-mono">{formatCurrency(todayLossAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{todayLossTrades.length} losing trades</p>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Today's Company Profit</p>
                  <p className={cn(
                    "text-2xl font-bold font-mono",
                    todayCompanyProfit >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatCurrency(todayCompanyProfit)}
                  </p>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Analytics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bets</p>
                    <p className="text-2xl font-bold">{weekTotalBets}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                    <p className="text-2xl font-bold font-mono">{formatCurrency(weekVolume)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company Profit</p>
                    <p className={cn(
                      "text-2xl font-bold font-mono",
                      weekCompanyProfit >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(weekCompanyProfit)}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Analytics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bets</p>
                    <p className="text-2xl font-bold">{monthTotalBets}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                    <p className="text-2xl font-bold font-mono">{formatCurrency(monthVolume)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company Profit</p>
                    <p className={cn(
                      "text-2xl font-bold font-mono",
                      monthCompanyProfit >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(monthCompanyProfit)}
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Today</p>
                    <p className="text-2xl font-bold">
                      {[...new Set(todayTrades.map(t => t.user_id))].length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Bets per User</p>
                    <p className="text-2xl font-bold">
                      {users.length > 0 ? (trades.length / users.length).toFixed(1) : "0"}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>
        </Tabs>

        <GlassCard className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="w-4 h-4 text-muted-foreground" />

            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-[200px] bg-muted/50">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] bg-muted/50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="UP">Buy</SelectItem>
                <SelectItem value="DOWN">Sell</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
                <SelectTrigger className="w-[140px] bg-muted/50">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(filterUser !== "all" || filterType !== "all" || dateRange !== "all") && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFilterUser("all");
                  setFilterType("all");
                  setDateRange("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </GlassCard>

        {loading ? (
          <GlassCard className="p-6 text-center text-sm text-muted-foreground">
            Loading trades...
          </GlassCard>
        ) : filteredTrades.length === 0 ? (
          <GlassCard className="p-6 text-center text-sm text-muted-foreground">
            No trades found for the selected filters.
          </GlassCard>
        ) : (
          <DataTable
            data={filteredTrades}
            columns={columns}
            searchKeys={["trade_id", "user_id", "full_name", "email"]}
            searchPlaceholder="Search trades..."
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default TradingHistory;