import type { JwtAccessTokenPayload } from '@snitch/types';
import type { Logger } from 'pino';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends JwtAccessTokenPayload {}
    interface Request {
      userId: string;
      requestId: string;
      logger: Logger;
    }
  }
}
