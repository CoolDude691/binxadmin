import { motion } from "framer-motion";
import { Users, TrendingUp, DollarSign, Activity, BarChart3, Shield, AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { MiniChart } from "@/components/ui/MiniChart";

const AdminDashboard = () => {
  return (
    <DashboardLayout isAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Users" value="12,456" change="+234 today" changeType="positive" icon={Users} iconColor="primary" />
          <StatCard title="Active Traders" value="3,892" change="+12%" changeType="positive" icon={Activity} iconColor="accent" />
          <StatCard title="Daily Volume" value="₹45.2M" change="+8.5%" changeType="positive" icon={TrendingUp} iconColor="warning" />
          <StatCard title="Platform Revenue" value="₹892K" change="+15%" changeType="positive" icon={DollarSign} iconColor="accent" chart={<MiniChart color="green" />} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GlassCard hover={false} className="p-4">
            <h3 className="font-semibold mb-4">Recent Registrations</h3>
            <div className="space-y-3">
              {[
                { name: "John Doe", email: "john@example.com", time: "2m ago", status: "Pending KYC" },
                { name: "Jane Smith", email: "jane@example.com", time: "15m ago", status: "Verified" },
                { name: "Bob Wilson", email: "bob@example.com", time: "1h ago", status: "Verified" },
              ].map((user, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <span className="font-medium">{user.name}</span>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${user.status === "Verified" ? "bg-accent/20 text-accent" : "bg-warning/20 text-warning"}`}>{user.status}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false} className="p-4">
            <h3 className="font-semibold mb-4">System Alerts</h3>
            <div className="space-y-3">
              {[
                { title: "High trading volume detected", type: "info", time: "5m ago" },
                { title: "Margin call triggered for 3 users", type: "warning", time: "12m ago" },
                { title: "Withdrawal limit exceeded", type: "error", time: "1h ago" },
              ].map((alert, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <AlertTriangle className={`w-5 h-5 ${alert.type === "error" ? "text-secondary" : alert.type === "warning" ? "text-warning" : "text-primary"}`} />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{alert.title}</span>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
