import orderModel from '@/models/order.model.js';
import Product from '@/models/product.model.js';
import User from '@/models/user.model.js';
import Review from '@/models/review.model.js';
import { CouponModel } from '@/models/coupon.model.js';
import { DatabaseOperationError } from '@/services/user.service.js';
import { createLogger } from '@/utils/logger.js';
import type {
  DashboardOverviewResponse,
  Order,
  UserResponseDto,
  Review as IReview,
  Product as IProduct,
} from '@snitch/types';
import dayjs from 'dayjs';

const logger = createLogger('DASHBOARD-SERVICE');

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

function getTrend(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  try {
    const now = dayjs();
    const startOfCurrentMonth = now.startOf('month').toDate();
    const startOfPreviousMonth = now.subtract(1, 'month').startOf('month').toDate();
    const endOfPreviousMonth = now.subtract(1, 'month').endOf('month').toDate();

    // 1. KPI Aggregation (Revenue, Orders, Customers, Products)
    // Run concurrent queries for efficiency
    const [
      salesAgg,
      customersAgg,
      productCountAgg,
      lowStockProducts,
      recentOrders,
      recentCustomers,
      recentReviews,
      couponSummaryAgg,
      categoryDistributionAgg,
    ] = await Promise.all([
      orderModel.aggregate([
        {
          $facet: {
            currentMonth: [
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
                  totalOrders: { $sum: 1 },
                },
              },
            ],
            previousMonth: [
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
                  totalOrders: { $sum: 1 },
                },
              },
            ],
          },
        },
      ]),
      User.aggregate([
        {
          $facet: {
            currentMonth: [
              { $match: { createdAt: { $gte: startOfCurrentMonth }, role: 'USER' } },
              { $count: 'count' },
            ],
            previousMonth: [
              {
                $match: {
                  createdAt: { $gte: startOfPreviousMonth, $lt: endOfPreviousMonth },
                  role: 'USER',
                },
              },
              { $count: 'count' },
            ],
            total: [{ $match: { role: 'USER' } }, { $count: 'count' }],
          },
        },
      ]),
      Product.aggregate([
        {
          $facet: {
            currentMonth: [
              { $match: { createdAt: { $gte: startOfCurrentMonth } } },
              { $count: 'count' },
            ],
            previousMonth: [
              { $match: { createdAt: { $gte: startOfPreviousMonth, $lt: endOfPreviousMonth } } },
              { $count: 'count' },
            ],
            total: [{ $count: 'count' }],
          },
        },
      ]),
      Product.find({ $expr: { $lte: ['$totalStock', '$lowStockThreshold'] } })
        .sort({ totalStock: 1 })
        .limit(5)
        .populate('category', 'name')
        .lean(),
      orderModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'id firstName lastName email avatar')
        .lean(),
      User.find({ role: 'USER' }).sort({ createdAt: -1 }).limit(5).select('-password').lean(),
      Review.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'id firstName lastName avatar')
        .populate('product', 'id title primaryImage')
        .lean(),
      CouponModel.aggregate([
        {
          $facet: {
            active: [
              { $match: { isActive: true, validUntil: { $gte: now.toDate() } } },
              { $count: 'count' },
            ],
            expired: [
              { $match: { $or: [{ isActive: false }, { validUntil: { $lt: now.toDate() } }] } },
              { $count: 'count' },
            ],
            totalUsed: [{ $group: { _id: null, sum: { $sum: '$usedCount' } } }],
          },
        },
      ]),
      Product.aggregate([
        { $unwind: '$category' },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryDoc',
          },
        },
        { $unwind: '$categoryDoc' },
        {
          $group: {
            _id: '$categoryDoc.name',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
    ]);

    // Parse KPI Data
    const currSales = salesAgg[0]?.currentMonth[0]?.totalRevenue || 0;
    const prevSales = salesAgg[0]?.previousMonth[0]?.totalRevenue || 0;
    const salesChange = calculateChange(currSales, prevSales);

    const currOrders = salesAgg[0]?.currentMonth[0]?.totalOrders || 0;
    const prevOrders = salesAgg[0]?.previousMonth[0]?.totalOrders || 0;
    const ordersChange = calculateChange(currOrders, prevOrders);

    const activeCustomers = customersAgg[0]?.total[0]?.count || 0;
    const currCustomers = customersAgg[0]?.currentMonth[0]?.count || 0;
    const prevCustomers = customersAgg[0]?.previousMonth[0]?.count || 0;
    const customersChange = calculateChange(currCustomers, prevCustomers);

    const totalProducts = productCountAgg[0]?.total[0]?.count || 0;
    const currProducts = productCountAgg[0]?.currentMonth[0]?.count || 0;
    const prevProducts = productCountAgg[0]?.previousMonth[0]?.count || 0;
    const productsChange = calculateChange(currProducts, prevProducts);

    // Parse Coupon Summary
    const couponSummary = {
      active: couponSummaryAgg[0]?.active[0]?.count || 0,
      expired: couponSummaryAgg[0]?.expired[0]?.count || 0,
      totalUsed: couponSummaryAgg[0]?.totalUsed[0]?.sum || 0,
    };

    // Parse Category Distribution
    const categoryDistribution = categoryDistributionAgg.map((cat) => ({
      name: cat._id,
      count: cat.count,
    }));

    return {
      metrics: {
        totalRevenue: { value: currSales, change: salesChange, trend: getTrend(salesChange) },
        totalOrders: { value: currOrders, change: ordersChange, trend: getTrend(ordersChange) },
        activeCustomers: {
          value: activeCustomers,
          change: customersChange,
          trend: getTrend(customersChange),
        },
        totalProducts: {
          value: totalProducts,
          change: productsChange,
          trend: getTrend(productsChange),
        },
      },
      recentOrders: recentOrders as unknown as Order[],
      recentCustomers: recentCustomers as unknown as UserResponseDto[],
      recentReviews: recentReviews as unknown as IReview[],
      lowStockProducts: lowStockProducts as unknown as IProduct[],
      categoryDistribution,
      couponSummary,
    };
  } catch (error) {
    logger.error({ err: error }, 'Error fetching dashboard overview');
    throw new DatabaseOperationError('getDashboardOverview', error);
  }
}
