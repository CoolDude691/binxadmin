import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MarketTable } from "@/components/trading/MarketTable";

const Markets = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Markets</h1>
          <p className="text-muted-foreground mt-1">
            Browse and trade cryptocurrency and forex pairs
          </p>
        </div>

        <MarketTable type="all" />
      </div>
    </DashboardLayout>
  );
};

export default Markets;
