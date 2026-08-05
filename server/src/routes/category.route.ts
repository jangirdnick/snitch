import { AuthAdminGuard } from '@/middlewares/auth.middleware.js';
import { CategoryController } from '@/controllers/category.controller.js';
import { Router } from 'express';
import multer from 'multer';

const router: Router = Router();
const adminRouter: Router = Router();

// ── Multer — memory storage, 5 MB limit, images only ─────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

// ── Public Routes ──────────────────────────────────────────────────────────────
router.get('/', CategoryController.getAll);
router.get('/id/:id', CategoryController.getById);
router.get('/:slug', CategoryController.getBySlug);

// ── Admin (Protected) Routes ───────────────────────────────────────────────────
adminRouter.use(AuthAdminGuard);

adminRouter.post('/', upload.single('image'), CategoryController.create);
adminRouter.put('/:id', upload.single('image'), CategoryController.update);
adminRouter.delete('/:id', CategoryController.delete);

router.use(adminRouter);

export default router;
