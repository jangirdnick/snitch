import { z } from 'zod';

const TicketPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
const TicketStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED']);
const TicketCategoryEnum = z.enum(['ORDER_ISSUE', 'REFUND', 'PRODUCT_QUERY', 'GENERAL']);

// Create Ticket Schema
export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters long')
    .max(200, 'Subject cannot exceed 200 characters'),
  category: TicketCategoryEnum,
  priority: TicketPriorityEnum,
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  orderId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID format')
    .optional(),
  productId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Product ID format')
    .optional(),
  mobileNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid mobile number format')
    .optional(),
  attachments: z
    .array(z.string().url('Invalid attachment URL'))
    .max(5, 'Maximum 5 attachments allowed')
    .optional(),
});
export type CreateTicketDto = z.infer<typeof createTicketSchema>;

// Reply Ticket Schema
export const replyTicketSchema = z.object({
  message: z.string().min(2, 'Reply must be at least 2 characters long'),
  attachments: z
    .array(z.string().url('Invalid attachment URL'))
    .max(5, 'Maximum 5 attachments allowed')
    .optional(),
});
export type ReplyTicketDto = z.infer<typeof replyTicketSchema>;

// Update Status/Priority Schema (Admin)
export const updateTicketStatusSchema = z.object({
  status: TicketStatusEnum.optional(),
  priority: TicketPriorityEnum.optional(),
  assignedAdmin: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Admin ID format')
    .optional(),
  resolutionDetails: z.string().optional(),
});
export type UpdateTicketStatusDto = z.infer<typeof updateTicketStatusSchema>;

// Internal Note Schema (Admin)
export const addInternalNoteSchema = z.object({
  note: z.string().min(2, 'Note must be at least 2 characters long'),
});
export type AddInternalNoteDto = z.infer<typeof addInternalNoteSchema>;
