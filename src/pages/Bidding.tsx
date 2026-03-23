import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, TrendingUp, TrendingDown, Trophy, Target, Zap } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";

const activeBids = [
  { id: "1", pair: "BTC/USDT", direction: "up", amount: "$500", timeLeft: "2:45", potential: "+$450", probability: 75 },
  { id: "2", pair: "ETH/USDT", direction: "down", amount: "$250", timeLeft: "5:12", potential: "+$225", probability: 60 },
  { id: "3", pair: "EUR/USD", direction: "up", amount: "$1,000", timeLeft: "0:58", potential: "+$900", probability: 82 },
];

const bidHistory = [
  { id: "1", pair: "BTC/USDT", direction: "up", amount: "$500", result: "win", profit: "+$450", time: "10m ago" },
  { id: "2", pair: "SOL/USDT", direction: "down", amount: "$300", result: "loss", profit: "-$300", time: "30m ago" },
  { id: "3", pair: "GBP/USD", direction: "up", amount: "$750", result: "win", profit: "+$675", time: "1h ago" },
  { id: "4", pair: "ETH/USDT", direction: "up", amount: "$200", result: "win", profit: "+$180", time: "2h ago" },
  { id: "5", pair: "USD/JPY", direction: "down", amount: "$400", result: "loss", profit: "-$400", time: "3h ago" },
];

const Bidding = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [bidAmount, setBidAmount] = useState("");
  const [duration, setDuration] = useState(5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Bidding</h1>
            <p className="text-muted-foreground mt-1">
              Predict price movements and earn rewards
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors btn-glow"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Create Bid</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Winnings"
            value="$12,450.00"
            change="+$2,340 today"
            changeType="positive"
            icon={Trophy}
            iconColor="accent"
          />
          <StatCard
            title="Win Rate"
            value="68%"
            change="+5% this week"
            changeType="positive"
            icon={Target}
            iconColor="primary"
          />
          <StatCard
            title="Active Bids"
            value="3"
            subtitle="$1,750 total"
            icon={Zap}
            iconColor="warning"
          />
          <StatCard
            title="Best Streak"
            value="12 wins"
            subtitle="Current: 4 wins"
            icon={TrendingUp}
            iconColor="accent"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Active Bids */}
          <div className="xl:col-span-2">
            <GlassCard hover={false} className="p-4">
              <h3 className="font-semibold mb-4">Active Bids</h3>
              <div className="space-y-4">
                {activeBids.map((bid, index) => (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            bid.direction === "up" ? "bg-accent/20" : "bg-secondary/20"
                          )}
                        >
                          {bid.direction === "up" ? (
                            <TrendingUp className="w-6 h-6 text-accent" />
                          ) : (
                            <TrendingDown className="w-6 h-6 text-secondary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{bid.pair}</span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-xs font-medium uppercase",
                                bid.direction === "up"
                                  ? "bg-accent/20 text-accent"
                                  : "bg-secondary/20 text-secondary"
                              )}
                            >
                              {bid.direction}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Bid: <span className="font-mono">{bid.amount}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Timer */}
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-warning">
                            <Clock className="w-4 h-4" />
                            <span className="font-mono text-lg font-bold">{bid.timeLeft}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Time Left</span>
                        </div>

                        {/* Probability */}
                        <div className="text-center">
                          <div className="relative w-12 h-12">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <circle
                                className="fill-none stroke-muted/30"
                                strokeWidth="3"
                                r="16"
                                cx="18"
                                cy="18"
                              />
                              <circle
                                className={cn(
                                  "fill-none",
                                  bid.probability >= 70 ? "stroke-accent" : bid.probability >= 50 ? "stroke-warning" : "stroke-secondary"
                                )}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${bid.probability}, 100`}
                                r="16"
                                cx="18"
                                cy="18"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                              {bid.probability}%
                            </span>
                          </div>
                        </div>

                        {/* Potential */}
                        <div className="text-right">
                          <span className="text-lg font-mono font-bold value-positive">{bid.potential}</span>
                          <p className="text-xs text-muted-foreground">Potential Win</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "100%" }}
                          animate={{ width: "30%" }}
                          transition={{ duration: 2 }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Create Bid Form */}
          <div className="space-y-6">
            <GlassCard variant="neon" hover={false} className="p-4">
              <h3 className="font-semibold mb-4">Quick Bid</h3>

              {/* Pair Selection */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">Select Pair</label>
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border/50 focus:outline-none focus:border-primary"
                >
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="SOL/USDT">SOL/USDT</option>
                  <option value="EUR/USD">EUR/USD</option>
                  <option value="GBP/USD">GBP/USD</option>
                </select>
              </div>

              {/* Direction */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDirection("up")}
                    className={cn(
                      "py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2",
                      direction === "up"
                        ? "bg-accent text-accent-foreground btn-glow-green"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <TrendingUp className="w-4 h-4" />
                    UP
                  </button>
                  <button
                    onClick={() => setDirection("down")}
                    className={cn(
                      "py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2",
                      direction === "down"
                        ? "bg-secondary text-secondary-foreground btn-glow-red"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <TrendingDown className="w-4 h-4" />
                    DOWN
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">Bid Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-muted/50 border border-border/50 font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {["100", "250", "500", "1000"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setBidAmount(amt)}
                      className="py-1.5 text-xs rounded bg-muted/50 hover:bg-muted transition-colors"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">Duration (minutes)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 15, 30].map((min) => (
                    <button
                      key={min}
                      onClick={() => setDuration(min)}
                      className={cn(
                        "py-2 rounded-lg text-sm font-medium transition-all",
                        duration === min
                          ? "bg-primary text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {min}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Potential Win */}
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Potential Win</span>
                  <span className="font-mono font-bold text-accent text-lg">
                    +${bidAmount ? (Number(bidAmount) * 0.9).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                className={cn(
                  "w-full py-3 rounded-lg font-semibold transition-all",
                  direction === "up"
                    ? "bg-accent text-accent-foreground btn-glow-green"
                    : "bg-secondary text-secondary-foreground btn-glow-red"
                )}
              >
                Place Bid
              </button>
            </GlassCard>

            {/* Bid History */}
            <GlassCard hover={false} className="p-4">
              <h3 className="font-semibold mb-4">Recent Results</h3>
              <div className="space-y-3">
                {bidHistory.slice(0, 4).map((bid, index) => (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          bid.result === "win" ? "bg-accent/20" : "bg-secondary/20"
                        )}
                      >
                        {bid.result === "win" ? (
                          <Trophy className="w-4 h-4 text-accent" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-secondary" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-sm">{bid.pair}</span>
                        <p className="text-xs text-muted-foreground">{bid.time}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "font-mono font-medium",
                        bid.result === "win" ? "value-positive" : "value-negative"
                      )}
                    >
                      {bid.profit}
                    </span>
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

export default Bidding;
