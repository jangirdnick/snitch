export interface KpiMetric {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface DashboardKpiResponse {
  totalSales: KpiMetric;
  productsSold: KpiMetric;
  todaysOrders: KpiMetric;
  cancelledOrders: KpiMetric;
}

export interface SalesAnalyticsData {
  month: string;
  revenue: number;
  orders: number;
}

export interface OrderOverviewData {
  status: string;
  count: number;
  revenue: number;
}

export interface AnalyticsDashboardResponse {
  kpi: DashboardKpiResponse;
  salesChart: SalesAnalyticsData[];
  orderOverview: OrderOverviewData[];
}
