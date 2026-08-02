import mongoose from 'mongoose';
import ticketModel, { type ITicket } from '@/models/ticket.model.js';
import { DatabaseOperationError } from '@/services/user.service.js';
import { createLogger } from '@/utils/logger.js';
import type {
  CreateTicketDto,
  ReplyTicketDto,
  UpdateTicketStatusDto,
  AddInternalNoteDto,
} from '@snitch/schemas';

const logger = createLogger('TICKET-SERVICE');

export class TicketNotFoundError extends Error {
  public readonly statusCode = 404;
  constructor(identifier: string) {
    super(`Ticket not found: ${identifier}`);
    this.name = 'TicketNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TicketOperationError extends Error {
  public readonly statusCode = 500;
  constructor(operation: string, cause?: unknown) {
    super(`Ticket operation error: ${operation}`);
    this.name = 'TicketOperationError';
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function isTicketError(error: unknown): boolean {
  return (
    error instanceof TicketNotFoundError ||
    error instanceof TicketOperationError ||
    error instanceof DatabaseOperationError
  );
}

export async function ticketCreate(userId: string, data: CreateTicketDto): Promise<ITicket> {
  try {
    const ticket = await ticketModel.create({
      ...data,
      user: userId,
      status: 'OPEN',
    });
    return ticket.toObject() as unknown as ITicket;
  } catch (error) {
    if (isTicketError(error)) throw error;
    logger.error({ err: error, userId }, 'Error creating ticket');
    throw new DatabaseOperationError('ticketCreate', error);
  }
}

export async function ticketGetAll(
  query: Record<string, unknown>,
): Promise<{ items: ITicket[]; total: number }> {
  try {
    const filter: Record<string, unknown> = {};

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.category) filter.category = query.category;
    if (query.ticketId) filter.ticketId = { $regex: query.ticketId, $options: 'i' };

    const limit = query.limit ? parseInt(query.limit as string) : 10;
    const page = query.page ? parseInt(query.page as string) : 1;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ticketModel
        .find(filter)
        .populate('user', 'id firstName lastName email avatar contact')
        .populate('assignedAdmin', 'id firstName lastName email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      ticketModel.countDocuments(filter),
    ]);

    return { items: items as unknown as ITicket[], total };
  } catch (error) {
    if (isTicketError(error)) throw error;
    logger.error({ err: error, query }, 'Error fetching all tickets');
    throw new DatabaseOperationError('ticketGetAll', error);
  }
}

export async function ticketGetByUser(userId: string): Promise<ITicket[]> {
  try {
    const items = await ticketModel.find({ user: userId }).sort({ createdAt: -1 }).lean().exec();

    return items as unknown as ITicket[];
  } catch (error) {
    if (isTicketError(error)) throw error;
    logger.error({ err: error, userId }, 'Error fetching user tickets');
    throw new DatabaseOperationError('ticketGetByUser', error);
  }
}

export async function ticketGetById(id: string): Promise<ITicket> {
  try {
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
    const ticket = await ticketModel
      .findOne(query)
      .populate('user', 'id firstName lastName email avatar contact')
      .populate('assignedAdmin', 'id firstName lastName email avatar')
      .populate('orderId', 'id orderNumber totalAmount status')
      .populate('productId', 'id title slug primaryImage')
      .lean()
      .exec();

    if (!ticket) {
      throw new TicketNotFoundError(id);
    }
    return ticket as unknown as ITicket;
  } catch (error) {
    if (isTicketError(error)) throw error;
    logger.error({ err: error, id }, 'Error fetching ticket by id');
    throw new DatabaseOperationError('ticketGetById', error);
  }
}

export async function ticketAddReply(
  id: string,
  senderId: string,
  senderModel: 'User' | 'Admin',
  data: ReplyTicketDto,
): Promise<ITicket> {
  try {
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
    const ticket = await ticketModel.findOne(query);
    if (!ticket) throw new TicketNotFoundError(id);

    ticket.replies.push({
      senderId: new mongoose.Types.ObjectId(senderId),
      senderModel,
      message: data.message,
      attachments: data.attachments || [],
    } as unknown as ITicket['replies'][0]);

    await ticket.save();

    return ticketGetById(id);
  } catch (error) {
    if (isTicketError(error)) throw error;
    logger.error({ err: error, id }, 'Error adding ticket reply');
    throw new DatabaseOperationError('ticketAddReply', error);
  }
}

export async function ticketUpdateStatus(
  id: string,
  data: UpdateTicketStatusDto,
): Promise<ITicket> {
  try {
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
    const ticket = await ticketModel.findOne(query);
    if (!ticket) throw new TicketNotFoundError(id);

    if (data.status) ticket.status = data.status;
    if (data.priority) ticket.priority = data.priority;
    if (data.assignedAdmin) ticket.assignedAdmin = new mongoose.Types.ObjectId(data.assignedAdmin);
    if (data.resolutionDetails) ticket.resolutionDetails = data.resolutionDetails;

    await ticket.save();

    return ticketGetById(id);
  } catch (error) {
    if (isTicketError(error)) throw error;
    logger.error({ err: error, id }, 'Error updating ticket status');
    throw new DatabaseOperationError('ticketUpdateStatus', error);
  }
}

export async function ticketAddInternalNote(
  id: string,
  data: AddInternalNoteDto,
): Promise<ITicket> {
  try {
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { id };
    const ticket = await ticketModel.findOne(query);
    if (!ticket) throw new TicketNotFoundError(id);

    ticket.internalNotes = ticket.internalNotes || [];
    ticket.internalNotes.push(data.note);

    await ticket.save();

    return ticketGetById(id);
  } catch (error) {
    if (isTicketError(error)) throw error;
    logger.error({ err: error, id }, 'Error adding ticket note');
    throw new DatabaseOperationError('ticketAddInternalNote', error);
  }
}
