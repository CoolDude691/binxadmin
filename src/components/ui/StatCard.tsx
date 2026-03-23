import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  iconColor?: "primary" | "accent" | "secondary" | "warning";
  subtitle?: string;
  chart?: ReactNode;
}

export const StatCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "primary",
  subtitle,
  chart,
}: StatCardProps) => {
  const iconColorClasses = {
    primary: "from-primary to-primary-glow",
    accent: "from-accent to-accent/70",
    secondary: "from-secondary to-secondary/70",
    warning: "from-warning to-warning/70",
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-bold font-mono tracking-tight"
            >
              {value}
            </motion.span>
            {change && (
              <span
                className={cn(
                  "text-sm font-mono font-medium",
                  changeType === "positive" && "value-positive",
                  changeType === "negative" && "value-negative",
                  changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {change}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
              iconColorClasses[iconColor]
            )}
            style={{
              boxShadow: iconColor === "primary" 
                ? "0 8px 24px hsla(217, 91%, 50%, 0.3)"
                : iconColor === "accent"
                ? "0 8px 24px hsla(160, 100%, 45%, 0.3)"
                : iconColor === "secondary"
                ? "0 8px 24px hsla(3, 94%, 50%, 0.3)"
                : "0 8px 24px hsla(38, 92%, 50%, 0.3)"
            }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      {chart && <div className="mt-4">{chart}</div>}
    </GlassCard>
  );
};
