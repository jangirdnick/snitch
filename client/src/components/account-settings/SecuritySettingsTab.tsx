import { memo, useEffect, useState } from 'react';
import { ShieldCheck, MonitorSmartphone, Globe, LogOut, Loader2 } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm';
import { type ChangePasswordDto } from '@snitch/schemas';
import { getSessions, revokeSession } from '@/features/auth/service/auth.api';
import { showToast } from '@/lib/toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface SecuritySettingsTabProps {
  onPasswordSave: (
    data: ChangePasswordDto,
  ) => Promise<{ success: boolean; message: string; error?: unknown }>;
  onPasswordDirtyChange?: (isDirty: boolean) => void;
}

interface SessionData {
  deviceId: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  expiredAt: Date;
  isCurrentSession: boolean;
}

export const SecuritySettingsTab = memo(function SecuritySettingsTab({
  onPasswordSave,
  onPasswordDirtyChange,
}: SecuritySettingsTabProps) {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await getSessions();
      if (res.success && res.data) {
        setSessions(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (deviceId: string) => {
    try {
      setRevokingId(deviceId);
      const res = await revokeSession(deviceId);
      if (res.success) {
        showToast.success('Session revoked successfully');
        setSessions((prev) => prev.filter((s) => s.deviceId !== deviceId));
      } else {
        showToast.error(res.error.message || 'Failed to revoke session');
      }
    } catch {
      showToast.error('An unexpected error occurred');
    } finally {
      setRevokingId(null);
    }
  };

  // Helper to parse OS/Browser from userAgent
  const parseUserAgent = (ua?: string) => {
    if (!ua) return { os: 'Unknown Device', browser: 'Unknown Browser' };

    let os = 'Unknown OS';
    if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS') || ua.includes('iPhone')) os = 'iOS';

    let browser = 'Unknown Browser';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';

    return { os, browser };
  };

  return (
    <div className="space-y-6">
      {/* Change Password Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <ShieldCheck size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Change Password</h3>
        </div>
        <ChangePasswordForm onSave={onPasswordSave} onDirtyChange={onPasswordDirtyChange} />
      </section>

      {/* Active Sessions Section */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MonitorSmartphone size={16} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Active Sessions</h3>
          </div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-medium">
            {sessions.length} Active
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 size={20} className="animate-spin text-white/40" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center rounded-xl border border-white/10 bg-white/5 text-xs text-white/50">
            No active sessions found.
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => {
              const { os, browser } = parseUserAgent(session.userAgent);
              return (
                <div
                  key={session.deviceId}
                  className="flex items-start justify-between p-3 rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/80 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      <MonitorSmartphone size={16} className="text-white/60" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white flex items-center gap-2">
                        {os} <span className="text-white/30 text-[10px]">&bull;</span> {browser}
                        {session.isCurrentSession && (
                          <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
                            Current
                          </span>
                        )}
                      </p>
                      <div className="mt-1 space-y-0.5">
                        <p className="text-[11px] text-white/50 flex items-center gap-1">
                          <Globe size={11} className="text-white/40" />
                          {session.ipAddress || 'Unknown IP'}
                        </p>
                        <p className="text-[10px] text-white/40">
                          Started {dayjs(session.createdAt).fromNow(true)} ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevokeSession(session.deviceId)}
                    disabled={revokingId === session.deviceId}
                    className="p-1.5 rounded-lg text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                    title="Revoke session"
                  >
                    {revokingId === session.deviceId ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <LogOut size={14} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
});

export default SecuritySettingsTab;
