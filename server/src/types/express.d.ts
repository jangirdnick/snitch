import { RequestUser } from './user.type.ts';

declare global {
  namespace Express {
    interface Request {
      user: RequestUser;
      userId: string;
      requestId: string;
    }
  }
}
