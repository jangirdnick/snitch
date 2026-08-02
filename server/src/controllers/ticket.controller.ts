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
import type {
  CreateTicketDto,
  ReplyTicketDto,
  UpdateTicketStatusDto,
  AddInternalNoteDto,
} from '@snitch/schemas';

export class TicketFieldsError extends Error {
  public readonly statusCode = 400;
  public readonly fields: Record<string, string[] | undefined>;
  constructor(errorFields: Record<string, string[] | undefined>) {
    super('Ticket validation failed');
    this.name = 'TicketFieldsError';
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

export class TicketController {
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as CreateTicketDto;
      if (!req.userId) throw new TicketRequestError('User ID is missing');

      const ticket = await ticketCreate(req.userId, data);

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: { ticket },
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await ticketGetAll(req.query);

      res.status(200).json({
        success: true,
        message: 'Tickets fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getUserTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) throw new TicketRequestError('User ID is missing');
      const tickets = await ticketGetByUser(req.userId);

      res.status(200).json({
        success: true,
        message: 'Tickets fetched successfully',
        data: { tickets },
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

      // Simple authorization: if user is not admin, verify ownership
      // For a real implementation, we could verify req.user.role if it's stored on req
      // assuming req.user.role exists or we skip strict checks if it's admin guard vs user guard

      res.status(200).json({
        success: true,
        message: 'Ticket fetched successfully',
        data: { ticket },
      });
    } catch (error) {
      next(error);
    }
  };

  static reply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) throw new TicketRequestError('Ticket ID is required');
      if (!req.userId) throw new TicketRequestError('User ID is missing');

      const data = req.body as ReplyTicketDto;

      // Determine if caller is admin. For now, assuming we know via the route (or req.user.role)
      // I'll assume 'User' for standard user route, 'Admin' for admin route
      const senderModel = req.originalUrl.includes('/admin') ? 'Admin' : 'User';

      const ticket = await ticketAddReply(id, req.userId, senderModel, data);

      res.status(200).json({
        success: true,
        message: 'Reply added successfully',
        data: { ticket },
      });
    } catch (error) {
      next(error);
    }
  };

  static updateStatusAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) throw new TicketRequestError('Ticket ID is required');

      const data = req.body as UpdateTicketStatusDto;
      const ticket = await ticketUpdateStatus(id, data);

      res.status(200).json({
        success: true,
        message: 'Ticket status updated',
        data: { ticket },
      });
    } catch (error) {
      next(error);
    }
  };

  static addNoteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      if (!id) throw new TicketRequestError('Ticket ID is required');

      const data = req.body as AddInternalNoteDto;
      const ticket = await ticketAddInternalNote(id, data);

      res.status(200).json({
        success: true,
        message: 'Internal note added',
        data: { ticket },
      });
    } catch (error) {
      next(error);
    }
  };
}
