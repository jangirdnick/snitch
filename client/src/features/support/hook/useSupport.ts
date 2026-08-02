import { useState, useCallback, useEffect } from 'react';
import { supportApi } from '../service/support.api';
import type { Ticket, TicketStatus, TicketPriority } from '@snitch/types';
import { showToast } from '@/lib/toast';
import { AxiosError } from 'axios';

export function useSupport(query: {
  page?: number;
  limit?: number;
  status?: TicketStatus | 'all';
  priority?: TicketPriority | 'all';
  ticketId?: string;
}) {
  const [data, setData] = useState<{
    items: Ticket[];
    pagination: {
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await supportApi.getAllTickets({
        page: query.page,
        limit: query.limit,
        status: query.status === 'all' ? undefined : (query.status as TicketStatus),
        priority: query.priority === 'all' ? undefined : (query.priority as TicketPriority),
        ticketId: query.ticketId || undefined,
      });
      setData({
        items: res.items,
        pagination: {
          currentPage: query.page || 1,
          itemsPerPage: query.limit || 10,
          totalItems: res.total,
          totalPages: Math.ceil(res.total / (query.limit || 10)),
          hasNextPage: (query.page || 1) < Math.ceil(res.total / (query.limit || 10)),
          hasPreviousPage: (query.page || 1) > 1,
        },
      });
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast.error('Failed to fetch tickets', { description: errMessage });
    } finally {
      setIsLoading(false);
    }
  }, [query.page, query.limit, query.status, query.priority, query.ticketId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTickets();
  }, [fetchTickets]);

  const updateStatus = async (
    id: string,
    payload: { status?: TicketStatus; priority?: TicketPriority },
  ) => {
    try {
      await supportApi.updateTicketStatus(id, payload);
      showToast.success('Ticket updated');
      fetchTickets();
      return true;
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : error instanceof AxiosError
            ? error.response?.data.error || error.response?.data.message
            : 'Unknown error';
      showToast.error('Update failed', { description: errMessage });
      return false;
    }
  };

  const addNote = async (id: string, note: string) => {
    try {
      await supportApi.addInternalNote(id, note);
      showToast.success('Note added');
      fetchTickets();
      return true;
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : error instanceof AxiosError
            ? error.response?.data.error || error.response?.data.message
            : 'Unknown error';
      showToast.error('Failed to add note', { description: errMessage });
      return false;
    }
  };

  const addReply = async (id: string, message: string) => {
    try {
      await supportApi.addReply(id, message);
      showToast.success('Reply sent');
      fetchTickets();
      return true;
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error
          ? error.message
          : error instanceof AxiosError
            ? error.response?.data.error || error.response?.data.message
            : 'Unknown error';
      showToast.error('Failed to send reply', { description: errMessage });
      return false;
    }
  };

  return { data, isLoading, updateStatus, addNote, addReply, refetch: fetchTickets };
}
