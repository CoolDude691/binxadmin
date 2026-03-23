// Mock data for Admin Panel

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "blocked";
  balance: number;
  referralCode: string;
  createdAt: string;
  avatar?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  walletAddress?: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "approved" | "rejected";
  transactionId: string;
  requestDate: string;
}

export interface Trade {
  id: string;
  userId: string;
  userName: string;
  asset: string;
  type: "buy" | "sell";
  amount: number;
  profitLoss: number;
  dateTime: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  duration: string;
  status: "active" | "inactive";
  description: string;
  features: string[];
}

export interface ReferralNode {
  id: string;
  name: string;
  email: string;
  level: number;
  earnings: number;
  referralCount: number;
  children?: ReferralNode[];
}

export interface BalanceHistory {
  id: string;
  userId: string;
  type: "add" | "deduct";
  amount: number;
  reason: string;
  date: string;
  adminName: string;
}

// Mock Users
export const mockUsers: User[] = [
  { id: "USR001", name: "John Doe", email: "john@example.com", phone: "+1234567890", status: "active", balance: 15420.50, referralCode: "JD2024", createdAt: "2024-01-15" },
  { id: "USR002", name: "Jane Smith", email: "jane@example.com", phone: "+1987654321", status: "active", balance: 8750.25, referralCode: "JS2024", createdAt: "2024-02-20" },
  { id: "USR003", name: "Bob Wilson", email: "bob@example.com", phone: "+1122334455", status: "blocked", balance: 0, referralCode: "BW2024", createdAt: "2024-01-10" },
  { id: "USR004", name: "Alice Brown", email: "alice@example.com", phone: "+1555666777", status: "active", balance: 25000.00, referralCode: "AB2024", createdAt: "2024-03-05" },
  { id: "USR005", name: "Charlie Davis", email: "charlie@example.com", phone: "+1888999000", status: "active", balance: 12300.75, referralCode: "CD2024", createdAt: "2024-02-28" },
  { id: "USR006", name: "Eva Martinez", email: "eva@example.com", phone: "+1444555666", status: "active", balance: 34500.00, referralCode: "EM2024", createdAt: "2024-01-22" },
  { id: "USR007", name: "Frank Johnson", email: "frank@example.com", phone: "+1777888999", status: "active", balance: 5600.80, referralCode: "FJ2024", createdAt: "2024-03-12" },
  { id: "USR008", name: "Grace Lee", email: "grace@example.com", phone: "+1333444555", status: "blocked", balance: 100.00, referralCode: "GL2024", createdAt: "2024-02-14" },
  { id: "USR009", name: "Henry Taylor", email: "henry@example.com", phone: "+1666777888", status: "active", balance: 18900.45, referralCode: "HT2024", createdAt: "2024-01-30" },
  { id: "USR010", name: "Ivy Chen", email: "ivy@example.com", phone: "+1222333444", status: "active", balance: 45000.00, referralCode: "IC2024", createdAt: "2024-03-01" },
];

// Mock Withdrawal Requests
export const mockWithdrawals: WithdrawalRequest[] = [
  { id: "WD001", userId: "USR001", userName: "John Doe", amount: 1500.00, paymentMethod: "Bank Transfer", status: "pending", requestDate: "2024-03-15", walletAddress: "****1234" },
  { id: "WD002", userId: "USR004", userName: "Alice Brown", amount: 5000.00, paymentMethod: "USDT (TRC20)", status: "pending", requestDate: "2024-03-14", walletAddress: "TXyz...abc" },
  { id: "WD003", userId: "USR002", userName: "Jane Smith", amount: 750.00, paymentMethod: "PayPal", status: "approved", requestDate: "2024-03-13" },
  { id: "WD004", userId: "USR005", userName: "Charlie Davis", amount: 2000.00, paymentMethod: "Bank Transfer", status: "rejected", requestDate: "2024-03-12", walletAddress: "****5678" },
  { id: "WD005", userId: "USR006", userName: "Eva Martinez", amount: 10000.00, paymentMethod: "Bitcoin", status: "pending", requestDate: "2024-03-15", walletAddress: "bc1q...xyz" },
  { id: "WD006", userId: "USR009", userName: "Henry Taylor", amount: 3500.00, paymentMethod: "Bank Transfer", status: "approved", requestDate: "2024-03-11" },
  { id: "WD007", userId: "USR010", userName: "Ivy Chen", amount: 8000.00, paymentMethod: "USDT (ERC20)", status: "pending", requestDate: "2024-03-15" },
];

// Mock Deposit Requests
export const mockDeposits: DepositRequest[] = [
  { id: "DEP001", userId: "USR001", userName: "John Doe", amount: 5000.00, paymentMethod: "Bank Transfer", status: "pending", transactionId: "TXN123456", requestDate: "2024-03-15" },
  { id: "DEP002", userId: "USR002", userName: "Jane Smith", amount: 2500.00, paymentMethod: "Credit Card", status: "approved", transactionId: "TXN789012", requestDate: "2024-03-14" },
  { id: "DEP003", userId: "USR004", userName: "Alice Brown", amount: 10000.00, paymentMethod: "USDT", status: "approved", transactionId: "TXN345678", requestDate: "2024-03-13" },
  { id: "DEP004", userId: "USR005", userName: "Charlie Davis", amount: 1500.00, paymentMethod: "PayPal", status: "pending", transactionId: "TXN901234", requestDate: "2024-03-15" },
  { id: "DEP005", userId: "USR006", userName: "Eva Martinez", amount: 15000.00, paymentMethod: "Wire Transfer", status: "pending", transactionId: "TXN567890", requestDate: "2024-03-15" },
  { id: "DEP006", userId: "USR007", userName: "Frank Johnson", amount: 3000.00, paymentMethod: "Bitcoin", status: "rejected", transactionId: "TXN234567", requestDate: "2024-03-12" },
];

// Mock Trades
export const mockTrades: Trade[] = [
  { id: "TRD001", userId: "USR001", userName: "John Doe", asset: "BTC/USDT", type: "buy", amount: 5000.00, profitLoss: 450.00, dateTime: "2024-03-15 14:30:00" },
  { id: "TRD002", userId: "USR002", userName: "Jane Smith", asset: "ETH/USDT", type: "sell", amount: 2500.00, profitLoss: -120.00, dateTime: "2024-03-15 13:45:00" },
  { id: "TRD003", userId: "USR004", userName: "Alice Brown", asset: "EUR/USD", type: "buy", amount: 10000.00, profitLoss: 890.00, dateTime: "2024-03-15 12:15:00" },
  { id: "TRD004", userId: "USR005", userName: "Charlie Davis", asset: "XRP/USDT", type: "sell", amount: 1500.00, profitLoss: 75.00, dateTime: "2024-03-15 11:30:00" },
  { id: "TRD005", userId: "USR006", userName: "Eva Martinez", asset: "GBP/USD", type: "buy", amount: 8000.00, profitLoss: -250.00, dateTime: "2024-03-14 16:45:00" },
  { id: "TRD006", userId: "USR007", userName: "Frank Johnson", asset: "SOL/USDT", type: "buy", amount: 3000.00, profitLoss: 560.00, dateTime: "2024-03-14 15:20:00" },
  { id: "TRD007", userId: "USR009", userName: "Henry Taylor", asset: "BTC/USDT", type: "sell", amount: 12000.00, profitLoss: 1200.00, dateTime: "2024-03-14 14:00:00" },
  { id: "TRD008", userId: "USR010", userName: "Ivy Chen", asset: "USD/JPY", type: "buy", amount: 25000.00, profitLoss: 1850.00, dateTime: "2024-03-14 10:30:00" },
  { id: "TRD009", userId: "USR001", userName: "John Doe", asset: "ADA/USDT", type: "buy", amount: 2000.00, profitLoss: -180.00, dateTime: "2024-03-13 16:00:00" },
  { id: "TRD010", userId: "USR004", userName: "Alice Brown", asset: "ETH/BTC", type: "sell", amount: 4500.00, profitLoss: 320.00, dateTime: "2024-03-13 11:45:00" },
];

// Mock Products/Plans
export const mockProducts: Product[] = [
  { id: "PLN001", name: "Starter Plan", price: 99, duration: "30 days", status: "active", description: "Perfect for beginners", features: ["Basic trading tools", "Email support", "5 trades/day"] },
  { id: "PLN002", name: "Pro Plan", price: 299, duration: "30 days", status: "active", description: "For serious traders", features: ["Advanced tools", "24/7 support", "Unlimited trades", "Analytics"] },
  { id: "PLN003", name: "Enterprise Plan", price: 999, duration: "30 days", status: "active", description: "Full platform access", features: ["All features", "Dedicated manager", "API access", "Custom reports"] },
  { id: "PLN004", name: "Trial Plan", price: 0, duration: "7 days", status: "active", description: "Try before you buy", features: ["Limited features", "3 trades/day"] },
  { id: "PLN005", name: "Annual Pro", price: 2499, duration: "365 days", status: "active", description: "Save 30% yearly", features: ["All Pro features", "Priority support", "Bonus credits"] },
  { id: "PLN006", name: "Legacy Plan", price: 199, duration: "30 days", status: "inactive", description: "Discontinued plan", features: ["Basic features"] },
];

// Mock Referral Tree
export const mockReferralTree: ReferralNode = {
  id: "USR001",
  name: "John Doe",
  email: "john@example.com",
  level: 0,
  earnings: 2500.00,
  referralCount: 5,
  children: [
    {
      id: "USR002",
      name: "Jane Smith",
      email: "jane@example.com",
      level: 1,
      earnings: 750.00,
      referralCount: 3,
      children: [
        { id: "USR005", name: "Charlie Davis", email: "charlie@example.com", level: 2, earnings: 200.00, referralCount: 1 },
        { id: "USR006", name: "Eva Martinez", email: "eva@example.com", level: 2, earnings: 350.00, referralCount: 2 },
        { id: "USR007", name: "Frank Johnson", email: "frank@example.com", level: 2, earnings: 100.00, referralCount: 0 },
      ]
    },
    {
      id: "USR004",
      name: "Alice Brown",
      email: "alice@example.com",
      level: 1,
      earnings: 1200.00,
      referralCount: 2,
      children: [
        { id: "USR009", name: "Henry Taylor", email: "henry@example.com", level: 2, earnings: 400.00, referralCount: 1 },
        { id: "USR010", name: "Ivy Chen", email: "ivy@example.com", level: 2, earnings: 600.00, referralCount: 0 },
      ]
    },
  ]
};

// Mock Balance History
export const mockBalanceHistory: BalanceHistory[] = [
  { id: "BAL001", userId: "USR001", type: "add", amount: 500.00, reason: "Bonus credit", date: "2024-03-15", adminName: "Admin" },
  { id: "BAL002", userId: "USR002", type: "deduct", amount: 100.00, reason: "Fee adjustment", date: "2024-03-14", adminName: "Admin" },
  { id: "BAL003", userId: "USR004", type: "add", amount: 1000.00, reason: "Referral bonus", date: "2024-03-13", adminName: "Admin" },
  { id: "BAL004", userId: "USR005", type: "add", amount: 250.00, reason: "Compensation", date: "2024-03-12", adminName: "Admin" },
  { id: "BAL005", userId: "USR006", type: "deduct", amount: 50.00, reason: "Service fee", date: "2024-03-11", adminName: "Admin" },
];

// Dashboard Stats
export const dashboardStats = {
  totalUsers: 10245,
  totalBalance: 2456789.50,
  totalWithdrawals: 892456.00,
  totalTopUps: 1567890.00,
  tradingVolume: 15678900.00,
  activeUsers: 8456,
  pendingWithdrawals: 12,
  pendingDeposits: 8,
};

// Chart Data
export const userGrowthData = [
  { month: "Jan", users: 2400 },
  { month: "Feb", users: 3600 },
  { month: "Mar", users: 4200 },
  { month: "Apr", users: 5100 },
  { month: "May", users: 6800 },
  { month: "Jun", users: 7500 },
  { month: "Jul", users: 8200 },
  { month: "Aug", users: 9100 },
  { month: "Sep", users: 9800 },
  { month: "Oct", users: 10245 },
];

export const depositWithdrawalData = [
  { month: "Jan", deposits: 125000, withdrawals: 85000 },
  { month: "Feb", deposits: 145000, withdrawals: 92000 },
  { month: "Mar", deposits: 168000, withdrawals: 98000 },
  { month: "Apr", deposits: 185000, withdrawals: 112000 },
  { month: "May", deposits: 210000, withdrawals: 125000 },
  { month: "Jun", deposits: 235000, withdrawals: 138000 },
];

export const tradingActivityData = [
  { day: "Mon", trades: 1250, volume: 2500000 },
  { day: "Tue", trades: 1480, volume: 2850000 },
  { day: "Wed", trades: 1320, volume: 2600000 },
  { day: "Thu", trades: 1680, volume: 3200000 },
  { day: "Fri", trades: 1890, volume: 3800000 },
  { day: "Sat", trades: 980, volume: 1900000 },
  { day: "Sun", trades: 750, volume: 1500000 },
];

export const recentActivities = [
  { id: 1, type: "user_register", message: "New user registered: Eva Martinez", time: "2 min ago" },
  { id: 2, type: "withdrawal", message: "Withdrawal request: $5,000 from Alice Brown", time: "5 min ago" },
  { id: 3, type: "deposit", message: "Deposit confirmed: $2,500 from Jane Smith", time: "12 min ago" },
  { id: 4, type: "trade", message: "Large trade executed: $25,000 BTC/USDT", time: "18 min ago" },
  { id: 5, type: "kyc", message: "KYC approved for Frank Johnson", time: "25 min ago" },
  { id: 6, type: "user_register", message: "New user registered: Mike Thompson", time: "32 min ago" },
  { id: 7, type: "withdrawal", message: "Withdrawal approved: $3,500 to Henry Taylor", time: "45 min ago" },
  { id: 8, type: "trade", message: "Trade closed with profit: +$1,200", time: "1 hour ago" },
];
