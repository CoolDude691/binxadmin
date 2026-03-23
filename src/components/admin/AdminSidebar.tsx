import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  GitBranch,
  TrendingUp,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "User Management", path: "/admin/users" },
  { icon: Wallet, label: "User Wallets", path: "/admin/wallets" },
  { icon: ArrowDownToLine, label: "Withdrawals", path: "/admin/withdrawals" },
  { icon: ArrowUpFromLine, label: "Top-Ups", path: "/admin/deposits" },
  { icon: GitBranch, label: "Referral Tree", path: "/admin/referrals" },
  { icon: TrendingUp, label: "Trading History", path: "/admin/trades" },
  { icon: Package, label: "Payrool Management", path: "/admin/products" },
  { icon: Package, label: "Manage Offers", path: "/admin/offers" },
  { icon: Package, label: "Manage Rewards", path: "/admin/reward" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
  { icon: Settings, label: "Manage Telegram", path: "/admin/manage-telegram" },
  { icon: Settings, label: "Manage Plateform", path: "/admin/manage-plateform" },
];

export const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-gradient-sidebar border-r border-border/50"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="relative w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-80" />
            <Shield className="w-5 h-5 text-white relative z-10" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gradient-primary">Binxtrade</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          )}
        </motion.div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {adminMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-muted/50 group relative",
                    isActive && "sidebar-active bg-primary/10"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={cn(
                          "font-medium text-sm whitespace-nowrap",
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="adminActiveIndicator"
                      className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary"
                      style={{ boxShadow: "0 0 10px hsl(var(--primary))" }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium text-sm"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};
