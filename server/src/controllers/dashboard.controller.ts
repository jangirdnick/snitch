import type { Request, Response, NextFunction } from 'express';
import { getDashboardOverview } from '@/services/dashboard.service.js';
import type { ApiSuccess, DashboardOverviewResponse } from '@snitch/types';
import { createLogger } from '@/utils/logger.js';

const logger = createLogger('DASHBOARD-CONTROLLER');

export class DashboardController {
  static async getOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await getDashboardOverview();
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
