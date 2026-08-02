import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import type { TicketCategory, TicketPriority, TicketStatus, SenderModel } from '@snitch/types';

export interface ITicket extends Document {
  id: string;
  ticketId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  user: mongoose.Types.ObjectId;
  mobileNumber?: string;
  orderId?: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  attachments?: string[];
  internalNotes?: string[];
  assignedAdmin?: mongoose.Types.ObjectId;
  resolutionDetails?: string;
  replies: {
    id: string;
    senderId: mongoose.Types.ObjectId;
    senderModel: SenderModel;
    message: string;
    attachments?: string[];
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const ticketReplySchema = new Schema(
  {
    id: { type: String, default: () => randomUUID() },
    senderId: { type: Schema.Types.ObjectId, required: true, refPath: 'replies.senderModel' },
    senderModel: { type: String, required: true, enum: ['User', 'Admin'] },
    message: { type: String, required: true, trim: true },
    attachments: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const ticketSchema: Schema<ITicket> = new Schema(
  {
    id: {
      type: String,
      default: () => randomUUID(),
      unique: true,
      index: true,
    },
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['ORDER_ISSUE', 'REFUND', 'PRODUCT_QUERY', 'GENERAL'],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mobileNumber: {
      type: String,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    attachments: [
      {
        type: String,
      },
    ],
    internalNotes: [
      {
        type: String,
      },
    ],
    assignedAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionDetails: {
      type: String,
    },
    replies: [ticketReplySchema],
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Pre-save hook to generate ticketId
ticketSchema.pre('save', function () {
  if (this.isNew && !this.ticketId) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.ticketId = `TCK-${randomNum}`;
  }
  if (this.isModified('status') && this.status === 'RESOLVED' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
});

ticketSchema.index({ user: 1, createdAt: -1 });
ticketSchema.index({ status: 1, priority: 1 });

const Ticket: Model<ITicket> =
  (mongoose.models.Ticket as Model<ITicket>) || mongoose.model<ITicket>('Ticket', ticketSchema);

export default Ticket;
