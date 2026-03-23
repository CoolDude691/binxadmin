import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Search, Moon, Sun, Menu, ChevronRight, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminTopBarProps {
  onMobileMenuToggle?: () => void;
}

const breadcrumbMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "User Management",
  "/admin/wallets": "User Wallets",
  "/admin/withdrawals": "Withdrawals",
  "/admin/deposits": "Top-Ups / Deposits",
  "/admin/referrals": "Referral Tree",
  "/admin/trades": "Trading History",
  "/admin/products": "Products / Plans",
  "/admin/settings": "Settings",
};

export const AdminTopBar = ({ onMobileMenuToggle }: AdminTopBarProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = breadcrumbMap[location.pathname] || "Dashboard";

  const notifications = [
    { id: 1, title: "New withdrawal request", time: "2 min ago", unread: true },
    { id: 2, title: "User KYC submitted", time: "15 min ago", unread: true },
    { id: 3, title: "Large deposit detected", time: "1 hour ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b border-border/50 backdrop-blur-xl bg-background/80"
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Admin</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{currentPage}</span>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-muted-foreground"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass-card border-border/50">
              <div className="p-3 border-b border-border/50">
                <h4 className="font-semibold">Notifications</h4>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                  <div className="flex items-start gap-3">
                    {notification.unread && (
                      <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    )}
                    <div className={cn(!notification.unread && "ml-5")}>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-muted-foreground">Super Admin</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card border-border/50">
              <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/admin/login")} className="cursor-pointer text-secondary">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};
