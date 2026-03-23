import { useState } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, TrendingDown, Search } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { MiniChart } from "../ui/MiniChart";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface MarketPair {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume: string;
  high: string;
  low: string;
  sparkline: number[];
  isFavorite?: boolean;
}

const cryptoPairs: MarketPair[] = [
  { id: "btc", symbol: "BTC/USDT", name: "Bitcoin", price: "67,234.50", change: 2.45, volume: "1.2B", high: "68,120.00", low: "65,800.00", sparkline: [30, 35, 40, 38, 45, 50, 48, 55, 52, 60, 58, 65] },
  { id: "eth", symbol: "ETH/USDT", name: "Ethereum", price: "3,456.78", change: -1.23, volume: "890M", high: "3,520.00", low: "3,380.00", sparkline: [60, 55, 52, 58, 50, 48, 52, 45, 48, 42, 45, 40] },
  { id: "bnb", symbol: "BNB/USDT", name: "BNB", price: "598.45", change: 0.87, volume: "245M", high: "605.00", low: "590.00", sparkline: [40, 42, 45, 43, 48, 50, 52, 55, 53, 58, 60, 62] },
  { id: "sol", symbol: "SOL/USDT", name: "Solana", price: "145.32", change: 5.67, volume: "567M", high: "148.00", low: "138.00", sparkline: [25, 30, 35, 40, 42, 50, 55, 60, 65, 70, 75, 80] },
  { id: "xrp", symbol: "XRP/USDT", name: "Ripple", price: "0.5234", change: -0.45, volume: "234M", high: "0.5400", low: "0.5100", sparkline: [50, 48, 52, 45, 48, 42, 45, 40, 42, 38, 40, 35] },
  { id: "ada", symbol: "ADA/USDT", name: "Cardano", price: "0.4567", change: 1.89, volume: "156M", high: "0.4700", low: "0.4450", sparkline: [35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 62] },
];

const forexPairs: MarketPair[] = [
  { id: "eurusd", symbol: "EUR/USD", name: "Euro/US Dollar", price: "1.0892", change: 0.12, volume: "5.2B", high: "1.0920", low: "1.0850", sparkline: [45, 48, 50, 52, 50, 55, 53, 58, 56, 60, 58, 62] },
  { id: "gbpusd", symbol: "GBP/USD", name: "British Pound", price: "1.2734", change: -0.08, volume: "3.8B", high: "1.2780", low: "1.2700", sparkline: [55, 52, 50, 48, 52, 45, 48, 42, 45, 40, 42, 38] },
  { id: "usdjpy", symbol: "USD/JPY", name: "US Dollar/Yen", price: "149.45", change: 0.34, volume: "4.1B", high: "149.80", low: "148.90", sparkline: [40, 42, 45, 48, 50, 52, 55, 58, 60, 62, 65, 68] },
  { id: "audusd", symbol: "AUD/USD", name: "Australian Dollar", price: "0.6534", change: 0.56, volume: "1.9B", high: "0.6580", low: "0.6500", sparkline: [38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 62, 65] },
];

interface MarketTableProps {
  type?: "crypto" | "forex" | "all";
  compact?: boolean;
}

export const MarketTable = ({ type = "all", compact = false }: MarketTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"crypto" | "forex">(type === "forex" ? "forex" : "crypto");

  const pairs = type === "crypto" ? cryptoPairs : type === "forex" ? forexPairs : activeTab === "crypto" ? cryptoPairs : forexPairs;

  const filteredPairs = pairs.filter(
    (pair) =>
      pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <GlassCard hover={false} className="overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {type === "all" && (
              <div className="flex rounded-lg bg-muted/30 p-1">
                {["crypto", "forex"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as "crypto" | "forex")}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-md transition-all",
                      activeTab === tab
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            )}
            <h3 className="font-semibold hidden sm:block">
              {type !== "all" ? `${type.charAt(0).toUpperCase() + type.slice(1)} Pairs` : ""}
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm outline-none w-full sm:w-48"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Pair</th>
              <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">Price</th>
              <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium">24h Change</th>
              {!compact && (
                <>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium hidden md:table-cell">Volume</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">High</th>
                  <th className="text-right px-4 py-3 text-xs text-muted-foreground font-medium hidden lg:table-cell">Low</th>
                </>
              )}
              <th className="px-4 py-3 text-xs text-muted-foreground font-medium text-center hidden sm:table-cell">7d Chart</th>
              <th className="px-4 py-3 text-xs text-muted-foreground font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPairs.map((pair, index) => (
              <motion.tr
                key={pair.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleFavorite(pair.id)}
                      className="text-muted-foreground hover:text-warning transition-colors"
                    >
                      <Star
                        className={cn(
                          "w-4 h-4",
                          favorites.includes(pair.id) && "fill-warning text-warning"
                        )}
                      />
                    </button>
                    <div>
                      <span className="font-semibold">{pair.symbol}</span>
                      <p className="text-xs text-muted-foreground">{pair.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-mono font-medium">${pair.price}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {pair.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-accent" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-secondary" />
                    )}
                    <span
                      className={cn(
                        "font-mono font-medium",
                        pair.change >= 0 ? "value-positive" : "value-negative"
                      )}
                    >
                      {pair.change >= 0 ? "+" : ""}{pair.change}%
                    </span>
                  </div>
                </td>
                {!compact && (
                  <>
                    <td className="px-4 py-4 text-right font-mono text-muted-foreground hidden md:table-cell">
                      ${pair.volume}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-muted-foreground hidden lg:table-cell">
                      ${pair.high}
                    </td>
                    <td className="px-4 py-4 text-right font-mono text-muted-foreground hidden lg:table-cell">
                      ${pair.low}
                    </td>
                  </>
                )}
                <td className="px-4 py-4 hidden sm:table-cell">
                  <div className="w-24 mx-auto">
                    <MiniChart
                      data={pair.sparkline}
                      color={pair.change >= 0 ? "green" : "red"}
                      height={30}
                    />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link
                    to={`/trade?pair=${pair.symbol}`}
                    className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-sm font-medium"
                  >
                    Trade
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
