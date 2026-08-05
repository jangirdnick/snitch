import type { Request, Response, NextFunction } from 'express';
import { getDashboardOverview } from '@/services/dashboard.service.js';
import { mediaService } from '@/services/media.service.js';
import type { ApiSuccess, DashboardOverviewResponse } from '@snitch/types';
import { createLogger } from '@/utils/logger.js';

const logger = createLogger('DASHBOARD-CONTROLLER');
const { generateUrl } = mediaService();

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

export class DashboardController {
  static async getOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await getDashboardOverview();

      // Format recent orders
      data.recentOrders?.forEach((order) => {
        if (order.user && typeof order.user === 'object' && order.user.avatar) {
          order.user.avatar = toPublicUrl(order.user.avatar);
        }
        order.items?.forEach((item) => {
          if (item.primaryImage) {
            item.primaryImage = toPublicUrl(item.primaryImage);
          }
        });
      });

      // Format recent customers
      data.recentCustomers?.forEach((customer) => {
        if (customer.avatar) {
          customer.avatar = toPublicUrl(customer.avatar);
        }
      });

      // Format recent reviews
      data.recentReviews?.forEach((review) => {
        if (review.user && typeof review.user === 'object' && review.user.avatar) {
          review.user.avatar = toPublicUrl(review.user.avatar);
        }
        if (review.product && typeof review.product === 'object') {
          review.product.colors?.forEach((c) => {
            c.images?.forEach((im) => {
              if (im.url) {
                im.url = toPublicUrl(im.url) || im.url;
              }
            });
          });
        }
      });

      // Format low stock products
      data.lowStockProducts?.forEach((product) => {
        product.colors?.forEach((color) => {
          color.images?.forEach((img) => {
            if (img.url) {
              img.url = toPublicUrl(img.url) || img.url;
            }
          });
        });
      });

      const response: ApiSuccess<DashboardOverviewResponse> = {
        success: true,
        message: 'Dashboard overview fetched successfully',
        data,
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error({ err: error }, 'Error in getOverview controller');
      next(error);
    }
  }
}
