import type { Request, Response, NextFunction } from 'express';
import { getDashboardAnalytics, getRecentDeliveredOrders } from '@/services/analytics.service.js';
import type { ApiSuccess, AnalyticsDashboardResponse, PaginatedOrders } from '@snitch/types';
import { z } from '@snitch/schemas';

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(5),
});

export class AnalyticsController {
  static getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getDashboardAnalytics();
      const response: ApiSuccess<AnalyticsDashboardResponse> = {
        success: true,
        message: 'Dashboard analytics retrieved successfully',
        data,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  static getRecentDeliveredOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const data = await getRecentDeliveredOrders(page, limit);
      const response: ApiSuccess<PaginatedOrders> = {
        success: true,
        message: 'Recent delivered orders retrieved successfully',
        data,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
