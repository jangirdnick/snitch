import express, { type Application, Response, Request } from 'express';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { httpLogger } from './middlewares/pino.middleware.js';
import { globalErrorFilter } from './filters/http-exception.filter.js';
import authRoute from './routes/auth.route.js';

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

app.use(httpLogger);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/auth', authRoute);

app.use(globalErrorFilter);
export default app;
