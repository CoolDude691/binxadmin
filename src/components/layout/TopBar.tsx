import { Bell, ChevronDown, Search, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

interface TopBarProps {
  onMenuToggle?: () => void;
}

export const TopBar = ({ onMenuToggle }: TopBarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  // Generate breadcrumb from path
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    path: "/" + pathSegments.slice(0, index + 1).join("/"),
  }));

  const stats = [
    { label: "Balance", value: "$45,231.89", change: "+2.5%" },
    { label: "Equity", value: "$48,102.54", change: "+3.1%" },
    { label: "Margin", value: "$12,450.00", change: null },
    { label: "PnL", value: "+$2,870.65", change: "+6.3%", isPositive: true },
  ];

  const notifications = [
    { id: 1, title: "BTC/USDT order filled", time: "2m ago", type: "success" },
    { id: 2, title: "Margin call warning", time: "15m ago", type: "warning" },
    { id: 3, title: "ETH deposit confirmed", time: "1h ago", type: "info" },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Mobile Menu + Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>

          <nav className="hidden sm:flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                <span className="text-muted-foreground/50">/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Center: Live Stats (Desktop) */}
        <div className="hidden xl:flex items-center gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <span className="font-mono text-sm font-medium">{stat.value}</span>
              {stat.change && (
                <span
                  className={`text-xs font-mono ${
                    stat.isPositive !== false && stat.change.startsWith("+")
                      ? "value-positive"
                      : "value-negative"
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm outline-none w-32 lg:w-48 placeholder:text-muted-foreground"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary" />
            </button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 glass-card-elevated p-4 rounded-xl"
              >
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notif.type === "success"
                            ? "bg-accent"
                            : notif.type === "warning"
                            ? "bg-warning"
                            : "bg-primary"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 text-sm text-primary hover:underline">
                  View all notifications
                </button>
              </motion.div>
            )}
          </div>

          {/* Profile */}
          <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xs font-bold text-white">JD</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
};
