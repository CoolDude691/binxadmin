import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";

interface TradingChartProps {
  title?: string;
  height?: number;
}

export const TradingChart = ({ title = "Price Chart", height = 400 }: TradingChartProps) => {
  // Generate random candlestick-like bars for visualization
  const bars = Array.from({ length: 50 }, (_, i) => ({
    x: i * 14,
    open: Math.random() * 100 + 50,
    close: Math.random() * 100 + 50,
    high: Math.random() * 30 + 150,
    low: Math.random() * 30 + 20,
  }));

  return (
    <GlassCard hover={false} className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex gap-2">
          {["1H", "4H", "1D", "1W", "1M"].map((tf) => (
            <button
              key={tf}
              className="px-3 py-1 text-xs rounded-md bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-muted/20" style={{ height }}>
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Grid lines */}
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={`${(i / 5) * 100}%`}
              x2="100%"
              y2={`${(i / 5) * 100}%`}
              stroke="hsla(217, 30%, 25%, 0.5)"
              strokeDasharray="4"
            />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={`${(i / 10) * 100}%`}
              y1="0"
              x2={`${(i / 10) * 100}%`}
              y2="100%"
              stroke="hsla(217, 30%, 25%, 0.5)"
              strokeDasharray="4"
            />
          ))}
        </svg>

        {/* Candlesticks */}
        <svg width="100%" height="100%" className="absolute inset-0" viewBox="0 0 700 200" preserveAspectRatio="none">
          {bars.map((bar, i) => {
            const isGreen = bar.close > bar.open;
            const top = Math.min(bar.open, bar.close);
            const bottom = Math.max(bar.open, bar.close);
            const bodyHeight = Math.abs(bar.close - bar.open);
            
            return (
              <motion.g
                key={i}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                style={{ transformOrigin: "center bottom" }}
              >
                {/* Wick */}
                <line
                  x1={bar.x + 4}
                  y1={200 - bar.high}
                  x2={bar.x + 4}
                  y2={200 - bar.low}
                  stroke={isGreen ? "hsl(160, 100%, 45%)" : "hsl(3, 94%, 50%)"}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={bar.x}
                  y={200 - top - bodyHeight}
                  width="8"
                  height={Math.max(bodyHeight, 2)}
                  fill={isGreen ? "hsl(160, 100%, 45%)" : "hsl(3, 94%, 50%)"}
                  rx="1"
                />
              </motion.g>
            );
          })}
        </svg>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 70%, hsla(218, 50%, 8%, 0.8) 100%)",
          }}
        />

        {/* Current price line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute right-0 top-1/3 w-full h-[1px] origin-right"
          style={{
            background: "linear-gradient(to left, hsl(217, 91%, 50%), transparent)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute right-2 top-1/3 -translate-y-1/2 px-2 py-1 rounded bg-primary text-xs font-mono text-white"
        >
          $67,234.50
        </motion.div>
      </div>
    </GlassCard>
  );
};
