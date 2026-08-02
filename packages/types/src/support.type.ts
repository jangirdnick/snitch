export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
export type TicketCategory = 'ORDER_ISSUE' | 'REFUND' | 'PRODUCT_QUERY' | 'GENERAL';
export type SenderModel = 'User' | 'Admin';

export interface TicketReply {
  _id: string;
  senderId: string;
  senderModel: SenderModel;
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  user: string | any; // Could be populated User
  mobileNumber?: string;
  orderId?: string | any;
  productId?: string | any;
  attachments?: string[];
  internalNotes?: string[];
  assignedAdmin?: string | any; // Could be populated Admin
  resolutionDetails?: string;
  replies: TicketReply[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

// Creation types
export interface ITicketCreate {
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  user: string; // ObjectId
  mobileNumber?: string;
  orderId?: string; // ObjectId
  productId?: string; // ObjectId
  attachments?: string[];
}

export interface ITicketReplyCreate {
  senderId: string; // ObjectId
  senderModel: SenderModel;
  message: string;
  attachments?: string[];
}
