import type { Request, Response, NextFunction } from 'express';
import { getDashboardAnalytics, getRecentDeliveredOrders } from '@/services/analytics.service.js';
import { mediaService } from '@/services/media.service.js';
import type { ApiSuccess, AnalyticsDashboardResponse, PaginatedOrders } from '@snitch/types';
import { z } from '@snitch/schemas';

const { generateUrl } = mediaService();

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(5),
});

function toPublicUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return undefined;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return undefined;
  if (/^(https?:\/\/|data:)/i.test(trimmed)) {
    return trimmed;
  }
  try {
    return generateUrl({
      path: trimmed,
      transformations: { width: 800, height: 800, format: 'webp', quality: 80 },
    });
  } catch {
    return trimmed;
  }
}

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

      data.items?.forEach((order) => {
        if (order.user && typeof order.user === 'object' && order.user.avatar) {
          order.user.avatar = toPublicUrl(order.user.avatar);
        }
        order.items?.forEach((item) => {
          if (item.primaryImage) {
            item.primaryImage = toPublicUrl(item.primaryImage);
          }
        });
      });

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
