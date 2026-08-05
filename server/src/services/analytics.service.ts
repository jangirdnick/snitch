import orderModel from '@/models/order.model.js';
import { DatabaseOperationError } from '@/services/user.service.js';
import { createLogger } from '@/utils/logger.js';
import type {
  DashboardKpiResponse,
  SalesAnalyticsData,
  OrderOverviewData,
  AnalyticsDashboardResponse,
  PaginatedOrders,
  Order as OrderType,
} from '@snitch/types';
import dayjs from 'dayjs';
const logger = createLogger('ANALYTICS-SERVICE');

export class AnalyticsOperationError extends Error {
  public readonly statusCode = 500;
  constructor(operation: string, cause?: unknown) {
    super(`Analytics operation error: ${operation}`);
    this.name = 'AnalyticsOperationError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

function getTrend(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

export async function getDashboardAnalytics(): Promise<AnalyticsDashboardResponse> {
  try {
    const now = dayjs();
    const startOfCurrentMonth = now.startOf('month').toDate();
    const startOfPreviousMonth = now.subtract(1, 'month').startOf('month').toDate();
    const endOfPreviousMonth = now.subtract(1, 'month').endOf('month').toDate();
    const startOfToday = now.startOf('day').toDate();
    const startOfYesterday = now.subtract(1, 'day').startOf('day').toDate();
    const endOfYesterday = now.subtract(1, 'day').endOf('day').toDate();

    const kpiAggregation = await orderModel.aggregate([
      {
        $facet: {
          currentMonthSales: [
            {
              $match: {
                createdAt: { $gte: startOfCurrentMonth },
                status: { $nin: ['cancelled', 'returned'] },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$netAmount' },
                productsSold: { $sum: { $sum: '$items.quantity' } },
              },
            },
          ],
          previousMonthSales: [
            {
              $match: {
                createdAt: { $gte: startOfPreviousMonth, $lt: endOfPreviousMonth },
                status: { $nin: ['cancelled', 'returned'] },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$netAmount' },
                productsSold: { $sum: { $sum: '$items.quantity' } },
              },
            },
          ],
          todayOrders: [{ $match: { createdAt: { $gte: startOfToday } } }, { $count: 'count' }],
          yesterdayOrders: [
            { $match: { createdAt: { $gte: startOfYesterday, $lt: endOfYesterday } } },
            { $count: 'count' },
          ],
          currentMonthCancelled: [
            { $match: { createdAt: { $gte: startOfCurrentMonth }, status: 'cancelled' } },
            { $count: 'count' },
          ],
          previousMonthCancelled: [
            {
              $match: {
                createdAt: { $gte: startOfPreviousMonth, $lt: endOfPreviousMonth },
                status: 'cancelled',
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    const kpi = kpiAggregation[0];

    const currSales = kpi.currentMonthSales[0]?.totalRevenue || 0;
    const prevSales = kpi.previousMonthSales[0]?.totalRevenue || 0;
    const salesChange = calculateChange(currSales, prevSales);

    const currProducts = kpi.currentMonthSales[0]?.productsSold || 0;
    const prevProducts = kpi.previousMonthSales[0]?.productsSold || 0;
    const productsChange = calculateChange(currProducts, prevProducts);

    const todayOrders = kpi.todayOrders[0]?.count || 0;
    const yestOrders = kpi.yesterdayOrders[0]?.count || 0;
    const todayChange = calculateChange(todayOrders, yestOrders);

    const currCancelled = kpi.currentMonthCancelled[0]?.count || 0;
    const prevCancelled = kpi.previousMonthCancelled[0]?.count || 0;
    const cancelledChange = calculateChange(currCancelled, prevCancelled);

    const dashboardKpi: DashboardKpiResponse = {
      totalSales: { value: currSales, change: salesChange, trend: getTrend(salesChange) },
      productsSold: {
        value: currProducts,
        change: productsChange,
        trend: getTrend(productsChange),
      },
      todaysOrders: { value: todayOrders, change: todayChange, trend: getTrend(todayChange) },
      cancelledOrders: {
        value: currCancelled,
        change: cancelledChange,
        trend: getTrend(cancelledChange),
      },
    };

    const startOf12MonthsAgo = now.subtract(11, 'month').startOf('month').toDate();
    const salesChartAgg = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOf12MonthsAgo },
          status: { $nin: ['cancelled', 'returned'] },
        },
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$netAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthsArray = Array.from({ length: 12 }).map((_, i) => {
      const d = now.subtract(11 - i, 'month');
      return { year: d.year(), month: d.month() + 1, label: d.format('MMM YYYY') };
    });

    const salesChart: SalesAnalyticsData[] = monthsArray.map((m) => {
      const found = salesChartAgg.find((s) => s._id.year === m.year && s._id.month === m.month);
      return {
        month: m.label,
        revenue: found ? found.revenue : 0,
        orders: found ? found.orders : 0,
      };
    });

    const startOf3MonthsAgo = now.subtract(2, 'month').startOf('month').toDate();
    const orderOverviewAgg = await orderModel.aggregate([
      { $match: { createdAt: { $gte: startOf3MonthsAgo } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$netAmount' },
        },
      },
    ]);

    const orderOverview: OrderOverviewData[] = orderOverviewAgg.map((agg) => ({
      status: agg._id,
      count: agg.count,
      revenue: agg.revenue,
    }));

    return {
      kpi: dashboardKpi,
      salesChart,
      orderOverview,
    };
  } catch (error) {
    logger.error({ err: error }, 'Error fetching dashboard analytics');
    throw new DatabaseOperationError('getDashboardAnalytics', error);
  }
}

export async function getRecentDeliveredOrders(
  page: number,
  limit: number,
): Promise<PaginatedOrders> {
  try {
    const filter = { status: 'delivered' } as const;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      orderModel
        .find(filter)
        .populate('user', 'id firstName lastName email avatar')
        .sort({ updatedAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      orderModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items as unknown as OrderType[],
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    logger.error({ err: error, page, limit }, 'Error fetching recent delivered orders');
    throw new DatabaseOperationError('getRecentDeliveredOrders', error);
  }
}
