import { Router } from 'express';
import { TicketController } from '@/controllers/ticket.controller.js';
import { AuthUserGuard, AuthAdminGuard } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import {
  createTicketSchema,
  replyTicketSchema,
  updateTicketStatusSchema,
  addInternalNoteSchema,
} from '@snitch/schemas';

const router: Router = Router();

// User Routes
router.post('/', AuthUserGuard, validate(createTicketSchema), TicketController.create);
router.get('/', AuthUserGuard, TicketController.getUserTickets);
router.get('/:id', AuthUserGuard, TicketController.getById);
router.post('/:id/reply', AuthUserGuard, validate(replyTicketSchema), TicketController.reply);

// Admin Routes
router.get('/admin/all', AuthAdminGuard, TicketController.getAllAdmin);
router.get('/admin/:id', AuthAdminGuard, TicketController.getById);
router.post(
  '/admin/:id/reply',
  AuthAdminGuard,
  validate(replyTicketSchema),
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
