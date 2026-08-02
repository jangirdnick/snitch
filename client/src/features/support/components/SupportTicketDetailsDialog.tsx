import { useState, useRef, useEffect } from 'react';
import type { Ticket, TicketStatus, TicketPriority } from '@snitch/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Clock,
  MessageSquare,
  ShieldAlert,
  User as UserIcon,
  Phone,
  Hash,
  Tag,
  Activity,
  ArrowRight,
  CornerDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportTicketDetailsDialogProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    payload: { status?: TicketStatus; priority?: TicketPriority },
  ) => Promise<boolean>;
  onAddNote: (id: string, note: string) => Promise<boolean>;
  onAddReply: (id: string, message: string) => Promise<boolean>;
}

export function SupportTicketDetailsDialog({
  ticket,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
  onAddReply,
}: SupportTicketDetailsDialogProps) {
  const [replyText, setReplyText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.replies]);

  if (!ticket) return null;

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    const success = await onAddReply(ticket._id, replyText);
    if (success) setReplyText('');
    setLoading(false);
  };

  const handleNote = async () => {
    if (!noteText.trim()) return;
    setLoading(true);
    const success = await onAddNote(ticket._id, noteText);
    if (success) setNoteText('');
    setLoading(false);
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'IN_PROGRESS':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'WAITING':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'RESOLVED':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'CLOSED':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-500';
      case 'HIGH':
        return 'text-orange-500';
      case 'MEDIUM':
        return 'text-amber-500';
      case 'LOW':
        return 'text-emerald-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] md:max-w-6xl bg-[oklch(0.12_0.005_260)] border-[oklch(1_0_0_/_0.1)] text-[oklch(0.95_0_0)] shadow-[0_32px_80px_oklch(0_0_0_/_0.7)] h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-8 py-6 border-b border-[oklch(1_0_0_/_0.08)] bg-gradient-to-b from-[oklch(1_0_0_/_0.03)] to-transparent flex-shrink-0">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            {/* Ticket Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 text-[oklch(0.55_0_0)] text-sm font-mono uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Hash className="size-3.5" /> {ticket.ticketId}
                </span>
                <span className="w-1 h-1 rounded-full bg-[oklch(1_0_0_/_0.2)]" />
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-[oklch(0.98_0_0)] leading-tight mb-4">
                {ticket.subject}
              </DialogTitle>
              <div className="flex flex-wrap gap-2.5">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs font-semibold px-3 py-1 bg-[oklch(1_0_0_/_0.02)] border-[oklch(1_0_0_/_0.1)]',
                    getPriorityColor(ticket.priority),
                  )}
                >
                  <Activity className="size-3.5 mr-1.5" />
                  {ticket.priority} Priority
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs px-3 py-1 bg-[oklch(1_0_0_/_0.02)] border-[oklch(1_0_0_/_0.1)] text-[oklch(0.8_0_0)]"
                >
                  <Tag className="size-3.5 mr-1.5" />
                  {ticket.category.replace('_', ' ')}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn('text-xs px-3 py-1 font-semibold', getStatusColor(ticket.status))}
                >
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            {/* Customer Snapshot */}
            <div className="flex flex-col gap-2.5 bg-[oklch(1_0_0_/_0.02)] border border-[oklch(1_0_0_/_0.08)] rounded-xl p-4 lg:min-w-[280px] shrink-0">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[oklch(0.45_0_0)]">
                Customer Profile
              </h4>
              <div className="flex items-center gap-3 text-[oklch(0.95_0_0)] font-medium">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <UserIcon className="size-4" />
                </div>
                <div className="truncate text-[14px]">
                  {ticket.user?.firstName} {ticket.user?.lastName}
                </div>
              </div>
              <div className="grid gap-2 mt-1 pl-11 text-[13px]">
                <div
                  className="flex items-center gap-2 text-[oklch(0.65_0_0)] truncate"
                  title={ticket.user?.email}
                >
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{ticket.user?.email}</span>
                </div>
                {ticket.user?.contact?.phoneNumber && (
                  <div className="flex items-center gap-2 text-[oklch(0.65_0_0)]">
                    <Phone className="size-3.5 shrink-0" />
                    <span>{ticket.user.contact.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3">
          {/* Main Content Area (Description & Replies) - 2/3 Width */}
          <div className="lg:col-span-2 flex flex-col h-full border-r border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.005)]">
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="p-8 space-y-8">
                {/* Original Description */}
                <div className="bg-[oklch(1_0_0_/_0.02)] p-6 rounded-2xl border border-[oklch(1_0_0_/_0.08)] shadow-[0_4px_12px_oklch(0_0_0_/_0.2)]">
                  <h4 className="font-bold text-[oklch(0.6_0_0)] mb-4 text-[11px] uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="size-4 text-[oklch(0.8_0_0)]" /> Original Request
                  </h4>
                  <p className="whitespace-pre-wrap text-[oklch(0.9_0_0)] text-[15px] leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-[oklch(1_0_0_/_0.08)]"></div>
                  <span className="flex-shrink-0 mx-4 text-[10px] uppercase font-bold tracking-widest text-[oklch(0.4_0_0)]">
                    Thread
                  </span>
                  <div className="flex-grow border-t border-[oklch(1_0_0_/_0.08)]"></div>
                </div>

                {/* Replies Thread */}
                <div className="space-y-6">
                  {ticket.replies?.map((reply, i) => {
                    const isAdmin = reply.senderModel === 'Admin';
                    return (
                      <div
                        key={reply._id || i}
                        className={cn(
                          'flex flex-col p-5 rounded-2xl max-w-[85%] shadow-sm',
                          isAdmin
                            ? 'ml-auto bg-[oklch(0.20_0.015_260)] border border-[oklch(0.28_0.015_260)] rounded-tr-sm'
                            : 'mr-auto bg-[oklch(1_0_0_/_0.03)] border border-[oklch(1_0_0_/_0.1)] rounded-tl-sm',
                        )}
                      >
                        <div className="flex items-center gap-2 text-[11px] font-semibold mb-3">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full',
                              isAdmin
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-orange-500/10 text-orange-400',
                            )}
                          >
                            {isAdmin ? 'Support Agent' : 'Customer'}
                          </span>
                          <span className="text-[oklch(0.45_0_0)] font-mono">
                            {new Date(reply.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            • {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-[15px] text-[oklch(0.95_0_0)] leading-relaxed">
                          {reply.message}
                        </p>
                      </div>
                    );
                  })}
                  {(!ticket.replies || ticket.replies.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-12 text-[oklch(0.4_0_0)]">
                      <CornerDownRight className="size-8 mb-3 opacity-50" />
                      <p className="text-[13px] font-medium tracking-wide">
                        No replies yet. Start the conversation.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* Reply Input Box */}
            <div className="p-6 bg-[oklch(1_0_0_/_0.02)] border-t border-[oklch(1_0_0_/_0.08)] backdrop-blur-md">
              <Textarea
                placeholder="Type a reply to the customer..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.15)] focus-visible:ring-[oklch(0.6_0_0)] focus-visible:border-[oklch(0.6_0_0)] min-h-[120px] text-[15px] resize-none mb-4 rounded-xl shadow-inner placeholder:text-[oklch(1_0_0_/_0.3)]"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[oklch(0.4_0_0)] font-medium">
                  Customer will be notified via email.
                </span>
                <Button
                  disabled={loading || !replyText.trim()}
                  onClick={handleReply}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-8 shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] transition-all"
                >
                  Send Reply <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar Area (Internal Notes & Status) - 1/3 Width */}
          <div className="flex flex-col h-full bg-[oklch(1_0_0_/_0.01)] relative">
            {/* Status Changer */}
            <div className="p-6 border-b border-[oklch(1_0_0_/_0.08)]">
              <h4 className="font-bold text-[oklch(0.55_0_0)] mb-4 text-[11px] uppercase tracking-widest flex items-center gap-2">
                Ticket Controls
              </h4>
              <label className="text-[12px] font-medium text-[oklch(0.7_0_0)] block mb-2">
                Ticket Status
              </label>

              <Select
                disabled={loading}
                value={ticket.status}
                onValueChange={(val) => onUpdateStatus(ticket._id, { status: val as TicketStatus })}
              >
                <SelectTrigger className="w-full bg-[oklch(1_0_0_/_0.03)] border-[oklch(1_0_0_/_0.15)] rounded-xl h-12 text-[14px] font-medium">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.15_0.005_260)] border-[oklch(1_0_0_/_0.1)] rounded-xl shadow-xl">
                  <SelectItem
                    value="OPEN"
                    className="focus:bg-[oklch(1_0_0_/_0.05)] cursor-pointer py-2.5"
                  >
                    Open
                  </SelectItem>
                  <SelectItem
                    value="IN_PROGRESS"
                    className="focus:bg-[oklch(1_0_0_/_0.05)] cursor-pointer py-2.5"
                  >
                    In Progress
                  </SelectItem>
                  <SelectItem
                    value="WAITING"
                    className="focus:bg-[oklch(1_0_0_/_0.05)] cursor-pointer py-2.5"
                  >
                    Waiting on Customer
                  </SelectItem>
                  <SelectItem
                    value="RESOLVED"
                    className="focus:bg-[oklch(1_0_0_/_0.05)] cursor-pointer py-2.5"
                  >
                    Resolved
                  </SelectItem>
                  <SelectItem
                    value="CLOSED"
                    className="focus:bg-[oklch(1_0_0_/_0.05)] cursor-pointer py-2.5"
                  >
                    Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Internal Notes Feed */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-5">
                <h4 className="font-bold text-amber-500/80 mb-5 text-[11px] uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="size-4" /> Internal Notes
                </h4>

                {ticket.internalNotes?.map((note, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute left-[-24px] top-4 w-4 border-b border-amber-500/20" />
                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-amber-200/90 text-[14px] shadow-sm leading-relaxed ml-2 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
                      {note}
                    </div>
                  </div>
                ))}

                {(!ticket.internalNotes || ticket.internalNotes.length === 0) && (
                  <div className="text-center py-10">
                    <ShieldAlert className="size-8 mx-auto text-amber-500/20 mb-3" />
                    <p className="text-[13px] text-amber-500/50 font-medium">
                      No internal notes yet.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Note Input */}
            <div className="p-6 border-t border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.015)]">
              <Textarea
                placeholder="Add private note for agents..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="bg-amber-500/5 border-amber-500/20 placeholder:text-amber-500/40 text-amber-100 min-h-[100px] text-[14px] resize-none mb-4 focus-visible:ring-amber-500/40 focus-visible:border-amber-500/40 rounded-xl"
              />
              <Button
                variant="outline"
                className="w-full h-11 text-amber-500 border-amber-500/30 hover:bg-amber-500/15 hover:text-amber-400 rounded-xl font-semibold shadow-sm transition-all hover:border-amber-500/50"
                disabled={loading || !noteText.trim()}
                onClick={handleNote}
              >
                Save Private Note
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
