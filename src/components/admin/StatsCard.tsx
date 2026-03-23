import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: "primary" | "secondary" | "accent" | "warning";
}

export const StatsCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "primary",
}: StatsCardProps) => {
  const iconColorClasses = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    accent: "bg-accent/20 text-accent",
    warning: "bg-warning/20 text-warning",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card p-5 card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold font-mono-trading">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm mt-1",
                changeType === "positive" && "text-accent",
                changeType === "negative" && "text-secondary",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            iconColorClasses[iconColor]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
