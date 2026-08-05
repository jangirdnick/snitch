import { Router } from 'express';
import { TicketController } from '@/controllers/ticket.controller.js';
import { AuthUserGuard, AuthAdminGuard } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import multer from 'multer';
import { updateTicketStatusSchema, addInternalNoteSchema } from '@snitch/schemas';

const router: Router = Router();

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

// User Routes
router.post('/', AuthUserGuard, upload.array('attachments', 5), TicketController.create);
router.get('/', AuthUserGuard, TicketController.getUserTickets);
router.get('/:id', AuthUserGuard, TicketController.getById);
router.post('/:id/reply', AuthUserGuard, upload.array('attachments', 5), TicketController.reply);

// Admin Routes
router.get('/admin/all', AuthAdminGuard, TicketController.getAllAdmin);
router.get('/admin/:id', AuthAdminGuard, TicketController.getById);
router.post(
  '/admin/:id/reply',
  AuthAdminGuard,
  upload.array('attachments', 5),
  TicketController.reply,
);
router.patch(
  '/admin/:id/status',
  AuthAdminGuard,
  validate(updateTicketStatusSchema),
  TicketController.updateStatusAdmin,
);
router.post(
  '/admin/:id/note',
  AuthAdminGuard,
  validate(addInternalNoteSchema),
  TicketController.addNoteAdmin,
);

export default router;
