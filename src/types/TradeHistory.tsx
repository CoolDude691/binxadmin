export type TradeHistory = {
  trade_id: string;
  trade_type: "UP" | "DOWN";
  base_amount: string;
  quantity: string;
  multiplier: string;
  total_amount: string;
  trade_time: string;
  user_id: string;
  full_name: string;
  email: string;
};