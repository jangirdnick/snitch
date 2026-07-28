import { AuthAdminGuard } from '@/middlewares/auth.middleware.js';
import { CategoryController } from '@/controllers/category.controller.js';
import { Router } from 'express';

const router: Router = Router();
const adminRouter: Router = Router();

// ── Public Routes ──────────────────────────────────────────────────────────────
router.get('/', CategoryController.getAll);
router.get('/id/:id', CategoryController.getById);
router.get('/:slug', CategoryController.getBySlug);

// ── Admin (Protected) Routes ───────────────────────────────────────────────────
adminRouter.use(AuthAdminGuard);

adminRouter.post('/', CategoryController.create);
adminRouter.put('/:id', CategoryController.update);
adminRouter.delete('/:id', CategoryController.delete);

router.use(adminRouter);

export default router;
