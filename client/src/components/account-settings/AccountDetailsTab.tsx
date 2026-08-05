import { memo, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { User, Mail, Calendar, Download, Loader2, Database } from 'lucide-react';
import { exportAccountData } from '@/features/auth/service/auth.api';
import { showToast } from '@/lib/toast';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export const AccountDetailsTab = memo(function AccountDetailsTab() {
  const { user } = useAppSelector((state) => state.auth);
  const [exporting, setExporting] = useState(false);

  if (!user) return null;

  const handleExportData = async () => {
    try {
      setExporting(true);
      const res = await exportAccountData();
      if (res.success && res.data) {
        // Create a downloadable JSON file
        const dataStr = JSON.stringify(res.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `snitch_account_data_${dayjs().format('YYYY-MM-DD')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast.success('Data exported successfully');
      } else {
        showToast.error(res.error.message || 'Failed to export data');
      }
    } catch {
      showToast.error('An unexpected error occurred during export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Info Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <User size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Account Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
              <User size={12} />
              Full Name
            </span>
            <p className="text-xs text-white font-medium">
              {user.firstName} {user.lastName || ''}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
              <Mail size={12} />
              Email Address
            </span>
            <p className="text-xs text-white font-medium break-all">{user.email}</p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 space-y-1 sm:col-span-2">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
              <Calendar size={12} />
              Member Since
            </span>
            <p className="text-xs text-white font-medium">
              {user.createdAt ? dayjs(user.createdAt).format('MMMM Do, YYYY') : 'Unknown'}
            </p>
          </div>
        </div>
      </section>

      {/* Export Data Section */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <Database size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Data Portability</h3>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-zinc-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white">Export Account Data</p>
            <p className="text-[11px] text-white/50 leading-relaxed max-w-sm">
              Download a copy of your personal data, including your profile information, settings,
              and activity history in JSON format.
            </p>
          </div>

          <button
            onClick={handleExportData}
            disabled={exporting}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {exporting ? 'Preparing...' : 'Request Data'}
          </button>
        </div>
      </section>
    </div>
  );
});

export default AccountDetailsTab;
