import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import Trade from "./pages/Trade";
import Wallet from "./pages/Wallet";
import Bidding from "./pages/Bidding";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagement from "./pages/admin/UserManagement";
import UserWallets from "./pages/admin/UserWallets";
import WithdrawalRequests from "./pages/admin/WithdrawalRequests";
import DepositRequests from "./pages/admin/DepositRequests";
import ReferralTree from "./pages/admin/ReferralTree";
import TradingHistory from "./pages/admin/TradingHistory";
import ProductManagement from "./pages/admin/ProductManagement";
import ManageOffers from "./pages/admin/ManageOffers";
import AdminSettings from "./pages/admin/AdminSettings";
import ManageRewards from "./pages/admin/ManageRewards";
import TelegramChannelManager from "./pages/admin/TelegramChannelManager";
import PlateformSetting from "./pages/admin/PlatformSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} /> */}
          
          {/* User Panel */}
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/bidding" element={<Bidding />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/history" element={<Orders />} />
          <Route path="/referral" element={<Dashboard />} />
          <Route path="/support" element={<Dashboard />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} /> */}
          
          {/* Admin Panel */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/wallets" element={<UserWallets />} />
          <Route path="/admin/withdrawals" element={<WithdrawalRequests />} />
          <Route path="/admin/deposits" element={<DepositRequests />} />
          <Route path="/admin/referrals" element={<ReferralTree />} />
          <Route path="/admin/trades" element={<TradingHistory />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/offers" element={<ManageOffers />} />
          <Route path="/admin/reward" element={<ManageRewards />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/manage-telegram" element={<TelegramChannelManager />} />
          <Route path="/admin/manage-plateform" element={<PlateformSetting />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
