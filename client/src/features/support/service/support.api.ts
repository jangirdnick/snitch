import { api } from '@/lib/axiosInstance';
import type {
  ApiSuccess,
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from '@snitch/types';

export const supportApi = {
  getAllTickets: async (params?: {
    page?: number;
    limit?: number;
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    ticketId?: string;
  }) => {
    const { data } = await api.get<ApiSuccess<{ items: Ticket[]; total: number }>>(
      '/ticket/admin/all',
      { params },
    );
    return data.data;
  },

  getTicketById: async (id: string) => {
    const { data } = await api.get<ApiSuccess<{ ticket: Ticket }>>(`/ticket/admin/${id}`);
    return data.data.ticket;
  },

  updateTicketStatus: async (
    id: string,
    payload: { status?: TicketStatus; priority?: TicketPriority },
  ) => {
    const { data } = await api.patch<ApiSuccess<{ ticket: Ticket }>>(
      `/ticket/admin/${id}/status`,
      payload,
    );
    return data.data.ticket;
  },

  addInternalNote: async (id: string, note: string) => {
    const { data } = await api.post<ApiSuccess<{ ticket: Ticket }>>(`/ticket/admin/${id}/note`, {
      note,
    });
    return data.data.ticket;
  },

  addReply: async (id: string, message: string, attachments?: string[]) => {
    const { data } = await api.post<ApiSuccess<{ ticket: Ticket }>>(`/ticket/admin/${id}/reply`, {
      message,
      attachments,
    });
    return data.data.ticket;
  },
};
