import { memo, useState } from 'react';
import { Moon, Sun, Monitor, Globe, Bell, Check, Sparkles } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';

export interface PreferencesState {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'hi' | 'es' | 'fr';
  notifications: {
    email: boolean;
    orders: boolean;
    marketing: boolean;
  };
}

const DEFAULT_PREFERENCES: PreferencesState = {
  theme: 'dark',
  language: 'en',
  notifications: {
    email: true,
    orders: true,
    marketing: false,
  },
};

export const AccountPreferencesForm = memo(function AccountPreferencesForm() {
  const [preferences, setPreferences] = useState<PreferencesState>(() => {
    try {
      const saved = localStorage.getItem('snitch_account_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [saving, setSaving] = useState(false);

  const handleThemeChange = (theme: PreferencesState['theme']) => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const handleLanguageChange = (language: PreferencesState['language']) => {
    setPreferences((prev) => ({ ...prev, language }));
  };

  const handleNotificationToggle = (key: keyof PreferencesState['notifications']) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem('snitch_account_preferences', JSON.stringify(preferences));
      showToast.success('Preferences updated successfully!');
    } catch {
      showToast.error('Failed to save preferences');
    } finally {
      setTimeout(() => setSaving(false), 300);
    }
  };

  return (
    <div className="space-y-4 text-xs sm:text-sm">
      {/* Section 1: Appearance / Theme */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
        <div className="flex items-center gap-2">
          <Moon size={15} className="text-orange-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Appearance Theme
          </h3>
        </div>
        <p className="text-[11px] text-white/50">
          Select your preferred color interface theme for Snitch.
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer',
              preferences.theme === 'dark'
                ? 'bg-orange-950/40 border-orange-500 text-white shadow-xs'
                : 'bg-zinc-900 border-white/10 text-white/60 hover:text-white hover:bg-white/5',
            )}
          >
            <Moon size={16} className={preferences.theme === 'dark' ? 'text-orange-400' : ''} />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer',
              preferences.theme === 'light'
                ? 'bg-orange-950/40 border-orange-500 text-white shadow-xs'
                : 'bg-zinc-900 border-white/10 text-white/60 hover:text-white hover:bg-white/5',
            )}
          >
            <Sun size={16} className={preferences.theme === 'light' ? 'text-amber-400' : ''} />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer',
              preferences.theme === 'system'
                ? 'bg-orange-950/40 border-orange-500 text-white shadow-xs'
                : 'bg-zinc-900 border-white/10 text-white/60 hover:text-white hover:bg-white/5',
            )}
          >
            <Monitor
              size={16}
              className={preferences.theme === 'system' ? 'text-indigo-400' : ''}
            />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* Section 2: Regional & Language */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
        <div className="flex items-center gap-2">
          <Globe size={15} className="text-indigo-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Display Language
          </h3>
        </div>

        <select
          value={preferences.language}
          onChange={(e) => handleLanguageChange(e.target.value as PreferencesState['language'])}
          className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-white/12 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
        >
          <option value="en" className="bg-zinc-950 text-white">
            English (US)
          </option>
          <option value="hi" className="bg-zinc-950 text-white">
            Hindi (हिंदी)
          </option>
          <option value="es" className="bg-zinc-950 text-white">
            Spanish (Español)
          </option>
          <option value="fr" className="bg-zinc-950 text-white">
            French (Français)
          </option>
        </select>
      </div>

      {/* Section 3: Notification Preferences */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <Bell size={15} className="text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h3>
        </div>

        <div className="space-y-2 text-xs">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-1.5 border-b border-white/5">
            <div>
              <p className="font-semibold text-white">Security Alerts & Email Notifications</p>
              <p className="text-[11px] text-white/40">
                Receive essential account and security updates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationToggle('email')}
              className={cn(
                'w-10 h-5 rounded-full transition-colors relative cursor-pointer',
                preferences.notifications.email ? 'bg-orange-600' : 'bg-white/15',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 size-4 rounded-full bg-white transition-transform',
                  preferences.notifications.email ? 'left-5.5' : 'left-0.5',
                )}
              />
            </button>
          </div>

          {/* Order & Delivery */}
          <div className="flex items-center justify-between py-1.5 border-b border-white/5">
            <div>
              <p className="font-semibold text-white">Order & Shipping Updates</p>
              <p className="text-[11px] text-white/40">
                Get notified about shipment tracking & delivery.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationToggle('orders')}
              className={cn(
                'w-10 h-5 rounded-full transition-colors relative cursor-pointer',
                preferences.notifications.orders ? 'bg-orange-600' : 'bg-white/15',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 size-4 rounded-full bg-white transition-transform',
                  preferences.notifications.orders ? 'left-5.5' : 'left-0.5',
                )}
              />
            </button>
          </div>

          {/* Marketing */}
          <div className="flex items-center justify-between py-1.5">
            <div>
              <p className="font-semibold text-white">Promotions & New Collections</p>
              <p className="text-[11px] text-white/40">
                Receive exclusive fashion offers & drop updates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleNotificationToggle('marketing')}
              className={cn(
                'w-10 h-5 rounded-full transition-colors relative cursor-pointer',
                preferences.notifications.marketing ? 'bg-orange-600' : 'bg-white/15',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 size-4 rounded-full bg-white transition-transform',
                  preferences.notifications.marketing ? 'left-5.5' : 'left-0.5',
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          {saving ? <Sparkles size={13} className="animate-spin" /> : <Check size={13} />}
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
});

export default AccountPreferencesForm;
