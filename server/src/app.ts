import express, { type Application, type Response, type Request, Router } from 'express';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { httpLogger } from './middlewares/pino.middleware.js';
import { globalErrorFilter } from './filters/http-exception.filter.js';
import { requestTracingMiddleware } from './middlewares/request-tracing.middleware.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// ROUTES
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import useProduct from './routes/product.route.js';
import categoryRoute from './routes/category.route.js';
import couponRoute from './routes/coupon.route.js';

const app: Application = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);
app.use(passport.initialize());

app.use(requestTracingMiddleware);
app.use(httpLogger);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    (_accessToken, _refreshToken, profile, done) => {
      return done(null, profile as unknown as Express.User);
    },
  ),
);

const apiRouter = Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok' });
});

apiRouter.use('/auth', authRoute);
apiRouter.use('/user', userRoute);
apiRouter.use('/product', useProduct);
apiRouter.use('/category', categoryRoute);
apiRouter.use('/coupon', couponRoute);

app.use('/api', apiRouter);

app.use(globalErrorFilter);
export default app;
