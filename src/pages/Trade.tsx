import { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TradeHistory } from "src/types/TradeHistory";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Maximize2,
  ChevronDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { TradingChart } from "@/components/ui/TradingChart";
import { cn } from "@/lib/utils";

const Trade = () => {
  const [searchParams] = useSearchParams();
  const pair = searchParams.get("pair") || "BTC/USDT";
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("67,234.50");
  const [leverage, setLeverage] = useState(10);

  const orderValue =
    Number(amount || 0) * Number(price.replace(/,/g, "")) * leverage;

  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetch("https://api.binxtrade.in/adminapi/get_user_trade_history.php")
      .then((res) => res.json())
      .then((data) => {
        setTrades(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  const selectTrade = (trade: TradeHistory) => {
    setSide(trade.trade_type === "UP" ? "buy" : "sell");
    setAmount(trade.quantity);
    setLeverage(Number(trade.multiplier));
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Trading Pair Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <span className="font-bold text-lg">{pair}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-2xl font-bold font-mono">$67,234.50</span>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-accent font-mono">+2.45%</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">24h High</span>
                  <p className="font-mono">$68,120.00</p>
                </div>
                <div>
                  <span className="text-muted-foreground">24h Low</span>
                  <p className="font-mono">$65,800.00</p>
                </div>
                <div>
                  <span className="text-muted-foreground">24h Volume</span>
                  <p className="font-mono">1.2B USDT</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Maximize2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Chart */}
          <div className="xl:col-span-3">
            <TradingChart title={`${pair} Chart`} height={500} />
          </div>

          {/* Order Panel */}
          <div className="space-y-4">
            {/* Order Book */}
            <GlassCard hover={false} className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Recent Trades</h3>

              {loading ? (
                <p className="text-xs text-muted-foreground">Loading trades...</p>
              ) : (
                <div className="space-y-2">
                  {trades.slice(0, 5).map((trade) => (
                    <div
                      key={trade.trade_id}
                      className="flex justify-between text-xs bg-muted/30 p-2 rounded-lg"
                    >
                      <span
                        className={
                          trade.trade_type === "UP"
                            ? "text-accent font-semibold"
                            : "text-secondary font-semibold"
                        }
                      >
                        {trade.trade_type === "UP" ? "BUY" : "SELL"}
                      </span>

                      <span className="font-mono">
                        ${trade.total_amount}
                      </span>

                      <span className="text-muted-foreground">
                        {new Date(trade.trade_time).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Order Form */}
            <GlassCard hover={false} className="p-4">
              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setSide("buy")}
                  className={cn(
                    "py-3 rounded-lg font-semibold transition-all",
                    side === "buy"
                      ? "bg-accent text-accent-foreground btn-glow-green"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Buy
                  </div>
                </button>
                <button
                  onClick={() => setSide("sell")}
                  className={cn(
                    "py-3 rounded-lg font-semibold transition-all",
                    side === "sell"
                      ? "bg-secondary text-secondary-foreground btn-glow-red"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Sell
                  </div>
                </button>
              </div>

              {/* Order Type */}
              <div className="flex rounded-lg bg-muted/30 p-1 mb-4">
                {["market", "limit", "stop"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type as typeof orderType)}
                    className={cn(
                      "flex-1 py-2 text-xs font-medium rounded-md transition-all capitalize",
                      orderType === type
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Price Input */}
              {orderType !== "market" && (
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border/50 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      USDT
                    </span>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="mb-3">
                <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border/50 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    BTC
                  </span>
                </div>
              </div>

              {/* Amount Quick Select */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {["25%", "50%", "75%", "100%"].map((pct) => (
                  <button
                    key={pct}
                    className="py-1.5 text-xs rounded bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {pct}
                  </button>
                ))}
              </div>

              {/* Leverage Slider */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted-foreground">Leverage</label>
                  <span className="text-sm font-mono font-semibold">{leverage}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1x</span>
                  <span>25x</span>
                  <span>50x</span>
                  <span>75x</span>
                  <span>100x</span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-3 rounded-lg bg-muted/30 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Value</span>
                  <span className="font-mono">${orderValue.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leverage</span>
                  <span className="font-mono">{leverage}x</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Fee</span>
                  <span className="font-mono">${(orderValue * 0.001).toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className={cn(
                  "w-full py-3 rounded-lg font-semibold transition-all",
                  side === "buy"
                    ? "bg-accent text-accent-foreground btn-glow-green"
                    : "bg-secondary text-secondary-foreground btn-glow-red"
                )}
              >
                {side === "buy" ? "Long" : "Short"} {pair.split("/")[0]}
              </button>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trade;
