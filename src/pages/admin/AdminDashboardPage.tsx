import { motion } from "framer-motion";
import { Users, DollarSign, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Activity, UserCheck, Clock } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { dashboardStats, userGrowthData, depositWithdrawalData, tradingActivityData, recentActivities } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const AdminDashboardPage = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={dashboardStats.totalUsers.toLocaleString()}
            change="+12.5% from last month"
            changeType="positive"
            icon={Users}
            iconColor="primary"
          />
          <StatsCard
            title="Total Balance"
            value={formatCurrency(dashboardStats.totalBalance)}
            change="+8.2% from last month"
            changeType="positive"
            icon={DollarSign}
            iconColor="accent"
          />
          <StatsCard
            title="Total Withdrawals"
            value={formatCurrency(dashboardStats.totalWithdrawals)}
            change={`${dashboardStats.pendingWithdrawals} pending`}
            changeType="neutral"
            icon={ArrowDownToLine}
            iconColor="secondary"
          />
          <StatsCard
            title="Total Top-Ups"
            value={formatCurrency(dashboardStats.totalTopUps)}
            change={`${dashboardStats.pendingDeposits} pending`}
            changeType="neutral"
            icon={ArrowUpFromLine}
            iconColor="warning"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Trading Volume"
            value={formatCurrency(dashboardStats.tradingVolume)}
            change="+15.3% this week"
            changeType="positive"
            icon={TrendingUp}
            iconColor="primary"
          />
          <StatsCard
            title="Active Users"
            value={dashboardStats.activeUsers.toLocaleString()}
            change="82.5% activity rate"
            changeType="positive"
            icon={UserCheck}
            iconColor="accent"
          />
          <StatsCard
            title="Pending Withdrawals"
            value={dashboardStats.pendingWithdrawals.toString()}
            change="Requires attention"
            changeType="negative"
            icon={Clock}
            iconColor="warning"
          />
          <StatsCard
            title="Pending Deposits"
            value={dashboardStats.pendingDeposits.toString()}
            change="Requires review"
            changeType="negative"
            icon={Activity}
            iconColor="secondary"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <GlassCard hover={false} className="p-5">
            <h3 className="font-semibold mb-4">User Growth</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(0, 0%, 100%, 0.1)" />
                  <XAxis dataKey="month" stroke="hsl(215, 16%, 60%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 16%, 60%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(218, 40%, 12%)",
                      border: "1px solid hsla(0, 0%, 100%, 0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(217, 91%, 50%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#userGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Deposits vs Withdrawals Chart */}
          <GlassCard hover={false} className="p-5">
            <h3 className="font-semibold mb-4">Deposits vs Withdrawals</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depositWithdrawalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(0, 0%, 100%, 0.1)" />
                  <XAxis dataKey="month" stroke="hsl(215, 16%, 60%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 16%, 60%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(218, 40%, 12%)",
                      border: "1px solid hsla(0, 0%, 100%, 0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="deposits" name="Deposits" fill="hsl(160, 100%, 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="withdrawals" name="Withdrawals" fill="hsl(3, 94%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Trading Activity & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Trading Activity Chart */}
          <GlassCard hover={false} className="p-5">
            <h3 className="font-semibold mb-4">Weekly Trading Activity</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradingActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(0, 0%, 100%, 0.1)" />
                  <XAxis dataKey="day" stroke="hsl(215, 16%, 60%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 16%, 60%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(218, 40%, 12%)",
                      border: "1px solid hsla(0, 0%, 100%, 0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="trades" name="Trades" fill="hsl(217, 91%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Recent Activities */}
          <GlassCard hover={false} className="p-5">
            <h3 className="font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {recentActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "user_register" ? "bg-primary" :
                    activity.type === "withdrawal" ? "bg-secondary" :
                    activity.type === "deposit" ? "bg-accent" :
                    activity.type === "trade" ? "bg-warning" : "bg-muted-foreground"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
