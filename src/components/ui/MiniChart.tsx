import { motion } from "framer-motion";

interface MiniChartProps {
  data?: number[];
  color?: "green" | "red" | "blue";
  height?: number;
}

export const MiniChart = ({ 
  data = [30, 40, 35, 50, 49, 60, 70, 65, 80, 75, 90, 85],
  color = "green",
  height = 40 
}: MiniChartProps) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: ((max - value) / range) * height,
  }));

  const linePath = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const areaPath = `${linePath} L 100 ${height} L 0 ${height} Z`;

  const colors = {
    green: {
      stroke: "hsl(160, 100%, 45%)",
      fill: "hsla(160, 100%, 45%, 0.1)",
      glow: "hsla(160, 100%, 45%, 0.3)",
    },
    red: {
      stroke: "hsl(3, 94%, 50%)",
      fill: "hsla(3, 94%, 50%, 0.1)",
      glow: "hsla(3, 94%, 50%, 0.3)",
    },
    blue: {
      stroke: "hsl(217, 91%, 50%)",
      fill: "hsla(217, 91%, 50%, 0.1)",
      glow: "hsla(217, 91%, 50%, 0.3)",
    },
  };

  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors[color].fill} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <filter id={`glow-${color}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Area */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        d={areaPath}
        fill={`url(#gradient-${color})`}
      />

      {/* Line */}
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        d={linePath}
        fill="none"
        stroke={colors[color].stroke}
        strokeWidth="2"
        strokeLinecap="round"
        filter={`url(#glow-${color})`}
      />

      {/* End dot */}
      <motion.circle
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill={colors[color].stroke}
        filter={`url(#glow-${color})`}
      />
    </svg>
  );
};
