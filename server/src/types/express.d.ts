import { UserResponseDto } from './user.type.ts';

declare global {
  namespace Express {
    interface Request {
      user: UserResponseDto;
      userId: string;
      requestId: string;
    }
  }
}
