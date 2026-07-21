import { AuthAdminGuard } from '@/middlewares/auth.middleware.js';
import { ProductController } from '@/controllers/product.controller.js';
import { Router } from 'express';
import multer from 'multer';

const router = Router();
const adminRouter = Router();

// ─── Multer — memory storage, 5 MB limit, images only ─────────────────────────
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
// GET /api/product?gender=men&status=active&page=1&limit=20&...
router.get('/', ProductController.getAll);
// GET /api/product/search/:term  — full-text search
router.get('/search/:search', ProductController.getSearch);
// GET /api/product/limited/:limit  — simple paginated fetch (homepage etc.)
router.get('/limited/:limit', ProductController.getLimited);
// GET /api/product/:slug  — product detail by slug
router.get('/:slug', ProductController.getBySlug);

// ── Admin (Protected) Routes ───────────────────────────────────────────────────
adminRouter.use(AuthAdminGuard);

// POST /api/product
//   multipart/form-data:
//     - `data`    : JSON string of full product (colors include `imageIndices` per color)
//     - `images`  : flat array of image files (referenced by index in each color)
// Multer MUST run before the controller so req.body and req.files are populated.
adminRouter.post('/', upload.array('images', 50), ProductController.create);

// PUT /api/product/:id  — partial update, JSON body, optionally images via multipart
// Images update: same `data` + `images` convention as create; omit colors to leave unchanged.
adminRouter.put('/:id', upload.array('images', 50), ProductController.update);

// DELETE /api/product/:id
adminRouter.delete('/:id', ProductController.delete);

router.use(adminRouter);

export default router;
