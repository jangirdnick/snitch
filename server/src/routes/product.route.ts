import { AuthAdminGuard } from '@/middlewares/auth.middleware.js';
import { ProductController } from '@/controllers/product.controller.js';
import { Router } from 'express';
import multer from 'multer';
import { validate } from '@/middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '@snitch/schemas';

const router = Router();
const adminRouter = Router();

// --- Helper Functions -------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// --- Public Routes --------------------
// router.get('/', ProductController.getAll);
router.get('/limited/:limit', ProductController.getLimited);
router.get('/search/:search', ProductController.getSearch);
router.get('/:slug', ProductController.getBySlug);

// --- Admin ( Protected Routes ) --------------------

// --- Middleware for Admin Routes only! ---
adminRouter.use(AuthAdminGuard);

adminRouter.post(
  '/',
  validate(createProductSchema),
  upload.array('images', 7),
  ProductController.create,
);
adminRouter.put(
  '/:slug',
  validate(updateProductSchema),
  upload.array('images', 7),
  ProductController.update,
);
adminRouter.delete('/:slug', ProductController.delete);

// --- Apply admin routes to main router ---
router.use(adminRouter);

export default router;
