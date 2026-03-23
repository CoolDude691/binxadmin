import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "elevated" | "neon";
  hover?: boolean;
  className?: string;
}

export const GlassCard = ({
  children,
  variant = "default",
  hover = true,
  className,
  ...props
}: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        variant === "default" && "glass-card",
        variant === "elevated" && "glass-card-elevated",
        variant === "neon" && "glass-card neon-border",
        hover && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
