import type { NextFunction, Request, Response } from 'express';
import {
  ticketCreate,
  ticketGetAll,
  ticketGetByUser,
  ticketGetById,
  ticketAddReply,
  ticketUpdateStatus,
  ticketAddInternalNote,
} from '@/services/ticket.service.js';
import { mediaService } from '@/services/media.service.js';
import {
  createTicketSchema,
  replyTicketSchema,
  updateTicketStatusSchema,
  addInternalNoteSchema,
} from '@snitch/schemas';

const { uploadMultipleMedia, deleteMultipleMedia, generateUrl } = mediaService();

export class TicketFieldsError extends Error {
  public readonly statusCode = 400;
  public readonly fields: Record<string, string[] | undefined>;
  constructor(errorFields: Record<string, string[] | undefined>) {
    super('Ticket validation failed');
    this.name = 'TicketValidationFailed';
    this.fields = errorFields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TicketRequestError extends Error {
  public readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'TicketRequestError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function parseJsonField(raw: unknown, fieldName: string): unknown {
  const fieldStr = raw as string;
  if (typeof fieldStr !== 'string' || !fieldStr.trim()) {
    throw new TicketFieldsError({ [fieldName]: ['Must be a non-empty JSON string'] });
  }
  try {
    return JSON.parse(fieldStr);
  } catch {
    throw new TicketFieldsError({ [fieldName]: ['Contains invalid JSON'] });
  }
}

function toPublicUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return undefined;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return undefined;
  if (/^(https?:\/\/|data:)/i.test(trimmed)) {
    return trimmed;
  }
  try {
    return generateUrl({
      path: trimmed,
      transformations: { width: 800, height: 800, format: 'webp', quality: 80 },
    });
  } catch {
    return trimmed;
  }
}

function formatTicketMedia(ticket: Record<string, unknown>): Record<string, unknown> {
  if (!ticket) return ticket;
  const formatted = { ...ticket };

  if (formatted.user && typeof formatted.user === 'object') {
    const u = { ...(formatted.user as Record<string, unknown>) };
    if (typeof u.avatar === 'string' && u.avatar) {
      u.avatar = toPublicUrl(u.avatar);
    }
    formatted.user = u;
  }

  if (formatted.assignedAdmin && typeof formatted.assignedAdmin === 'object') {
    const a = { ...(formatted.assignedAdmin as Record<string, unknown>) };
    if (typeof a.avatar === 'string' && a.avatar) {
      a.avatar = toPublicUrl(a.avatar);
    }
    formatted.assignedAdmin = a;
  }

  if (formatted.productId && typeof formatted.productId === 'object') {
    const p = { ...(formatted.productId as Record<string, unknown>) };
    if (Array.isArray(p.colors)) {
      (p.colors as Array<{ images?: Array<{ url: string }> }>).forEach((color) => {
        color.images?.forEach((img) => {
          if (img.url) {
            const resolved = toPublicUrl(img.url);
            if (resolved) img.url = resolved;
          }
        });
      });
    }
    formatted.productId = p;
  }

  if (Array.isArray(formatted.attachments)) {
    formatted.attachments = formatted.attachments.map((att) => {
      if (typeof att === 'string' && att) {
        return toPublicUrl(att) || att;
      }
      return att;
    });
  }

  return formatted;
}

export class TicketController {
  static create = async (req: Request, res: Response, next: NextFunction) => {
    let uploadedPaths: string[] = [];
    try {
      if (!req.userId) throw new TicketRequestError('User ID is missing');

      let rawBody: Record<string, unknown>;
      if (req.body?.data) {
        rawBody = parseJsonField(req.body.data, 'data') as Record<string, unknown>;
      } else {
        rawBody = { ...req.body };
      }

      const files = (req.files as Express.Multer.File[]) ?? [];
      if (files.length > 0) {
        const uploaded = await uploadMultipleMedia({
          files,
          folder: 'tickets',
          prefix: `ticket-${req.userId}`,
        });
        uploadedPaths = uploaded.map((u) => u.imagePath);
        const fileUrls = uploaded.map((u) => u.url);
        rawBody.attachments = [
          ...(Array.isArray(rawBody.attachments) ? (rawBody.attachments as string[]) : []),
          ...fileUrls,
        ];
      }

      const validation = createTicketSchema.safeParse(rawBody);
      if (!validation.success) {
        throw new TicketFieldsError(validation.error.flatten().fieldErrors);
      }

      let ticket;
      try {
        ticket = await ticketCreate(req.userId, validation.data);
      } catch (dbError) {
        if (uploadedPaths.length > 0) {
          await deleteMultipleMedia(uploadedPaths).catch((err) => {
            req.logger?.error(
              { err, uploadedPaths },
              'Failed to delete ticket attachments on DB failure',
            );
          });
        }
        throw dbError;
      }

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: { ticket: formatTicketMedia(ticket as unknown as Record<string, unknown>) },
      });
    } catch (error) {
      if (uploadedPaths.length > 0) {
        await deleteMultipleMedia(uploadedPaths).catch((err) => {
          req.logger?.error({ err, uploadedPaths }, 'Failed to rollback ticket attachments');
        });
      }
      next(error);
    }
  };

  static getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ticketGetAll(req.query);
      const formattedItems = result.items.map((item) =>
        formatTicketMedia(item as unknown as Record<string, unknown>),
      );

      res.status(200).json({
        success: true,
        message: 'Tickets fetched successfully',
        data: { items: formattedItems, total: result.total },
      });
    } catch (error) {
      next(error);
    }
  };

  static getUserTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) throw new TicketRequestError('User ID is missing');
      const tickets = await ticketGetByUser(req.userId);
      const formattedTickets = tickets.map((t) =>
        formatTicketMedia(t as unknown as Record<string, unknown>),
      );

      res.status(200).json({
        success: true,
        message: 'Tickets fetched successfully',
        data: { tickets: formattedTickets },
      });
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) throw new TicketRequestError('Ticket ID is required');

      const ticket = await ticketGetById(id);
      const formattedTicket = formatTicketMedia(ticket as unknown as Record<string, unknown>);

      res.status(200).json({
        success: true,
        message: 'Ticket fetched successfully',
        data: { ticket: formattedTicket },
      });
    } catch (error) {
      next(error);
    }
  };

  static reply = async (req: Request, res: Response, next: NextFunction) => {
    let uploadedPaths: string[] = [];
    try {
      const { id } = req.params as { id: string };
      if (!id) throw new TicketRequestError('Ticket ID is required');
      if (!req.userId) throw new TicketRequestError('User ID is missing');

      let rawBody: Record<string, unknown>;
      if (req.body?.data) {
        rawBody = parseJsonField(req.body.data, 'data') as Record<string, unknown>;
      } else {
        rawBody = { ...req.body };
      }

      const files = (req.files as Express.Multer.File[]) ?? [];
      if (files.length > 0) {
        const uploaded = await uploadMultipleMedia({
          files,
          folder: 'tickets',
          prefix: `reply-${id}`,
        });
        uploadedPaths = uploaded.map((u) => u.imagePath);
        const fileUrls = uploaded.map((u) => u.url);
        rawBody.attachments = [
          ...(Array.isArray(rawBody.attachments) ? (rawBody.attachments as string[]) : []),
          ...fileUrls,
        ];
      }

      const validation = replyTicketSchema.safeParse(rawBody);
      if (!validation.success) {
        throw new TicketFieldsError(validation.error.flatten().fieldErrors);
      }

      const senderModel = req.originalUrl.includes('/admin') ? 'Admin' : 'User';

      let ticket;
      try {
        ticket = await ticketAddReply(id, req.userId, senderModel, validation.data);
      } catch (dbError) {
        if (uploadedPaths.length > 0) {
          await deleteMultipleMedia(uploadedPaths).catch((err) => {
            req.logger?.error(
              { err, uploadedPaths },
              'Failed to delete reply attachments on DB failure',
            );
          });
        }
        throw dbError;
      }

      res.status(201).json({
        success: true,
        message: 'Reply added successfully',
        data: { ticket: formatTicketMedia(ticket as unknown as Record<string, unknown>) },
      });
    } catch (error) {
      if (uploadedPaths.length > 0) {
        await deleteMultipleMedia(uploadedPaths).catch((err) => {
          req.logger?.error({ err, uploadedPaths }, 'Failed to rollback reply attachments');
        });
      }
      next(error);
    }
  };

  static updateStatusAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) throw new TicketRequestError('Ticket ID is required');

      const validation = updateTicketStatusSchema.safeParse(req.body);
      if (!validation.success) {
        throw new TicketFieldsError(validation.error.flatten().fieldErrors);
      }

      const ticket = await ticketUpdateStatus(id, validation.data);

      res.status(200).json({
        success: true,
        message: 'Ticket status updated',
        data: { ticket: formatTicketMedia(ticket as unknown as Record<string, unknown>) },
      });
    } catch (error) {
      next(error);
    }
  };

  static addNoteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) throw new TicketRequestError('Ticket ID is required');

      const validation = addInternalNoteSchema.safeParse(req.body);
      if (!validation.success) {
        throw new TicketFieldsError(validation.error.flatten().fieldErrors);
      }

      const ticket = await ticketAddInternalNote(id, validation.data);

      res.status(200).json({
        success: true,
        message: 'Internal note added',
        data: { ticket: formatTicketMedia(ticket as unknown as Record<string, unknown>) },
      });
    } catch (error) {
      next(error);
    }
  };
}
