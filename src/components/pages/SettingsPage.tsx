import { useState } from 'react';
import { User, Bell, Shield, Palette, CreditCard, Key, Mail, Globe, Moon, Sun, Check, ChevronRight, Camera, LogOut, Trash2, Download, RefreshCw, Lock, Eye, EyeOff, Building2, Users, FileText, BarChart2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance' | 'billing' | 'team';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
    { id: 'appearance' as SettingsTab, label: 'Appearance', icon: Palette },
    { id: 'billing' as SettingsTab, label: 'Billing', icon: CreditCard },
    { id: 'team' as SettingsTab, label: 'Team', icon: Users },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeTab === id ? 'bg-[#4F46E5]/10 text-[#4F46E5]' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>Profile Settings</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-2xl font-bold">
                    JD
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors">
                    <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">John Doe</h3>
                  <p className="text-xs text-muted-foreground">john@company.com</p>
                  <button className="text-xs text-[#4F46E5] hover:underline mt-1">Change avatar</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full mt-1 px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <input
                    type="email"
                    defaultValue="john@company.com"
                    className="w-full mt-1 px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Company</label>
                  <input
                    type="text"
                    defaultValue="Acme Inc."
                    className="w-full mt-1 px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Role</label>
                  <input
                    type="text"
                    defaultValue="Data Analyst"
                    className="w-full mt-1 px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
                  <Check className="w-3.5 h-3.5" /> Save Changes
                </button>
                <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2 text-xs bg-transparent border border-border text-foreground hover:bg-muted">
                  Cancel
                </button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { label: 'Email notifications', desc: 'Receive email updates for important events', checked: true },
                  { label: 'Weekly digest', desc: 'Get a weekly summary of your data insights', checked: true },
                  { label: 'Anomaly alerts', desc: 'Get notified when anomalies are detected', checked: true },
                  { label: 'Report ready', desc: 'Notification when generated reports are ready', checked: false },
                  { label: 'Team activity', desc: 'Updates from team members', checked: false },
                ].map(({ label, desc, checked }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                    <div className={cn('w-10 h-6 rounded-full transition-colors cursor-pointer', checked ? 'bg-[#4F46E5]' : 'bg-muted')} onClick={() => {}}>
                      <div className={cn('w-4 h-4 rounded-full bg-white transition-transform mt-1', checked ? 'translate-x-5' : 'translate-x-1')} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-4 py-2 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
                  <Check className="w-3.5 h-3.5" /> Save Preferences
                </button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Change Password</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Current Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full mt-1 px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">New Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full mt-1 px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:border-[#4F46E5]"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground">Authenticator App</div>
                      <div className="text-xs text-muted-foreground">Use an authenticator app to generate one-time codes</div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500">Enabled</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">API Keys</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-foreground">Production Key</div>
                        <div className="text-xs text-muted-foreground font-mono">sk_live_••••••••••••••••</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-muted-foreground hover:text-foreground">Regenerate</button>
                        <button className="text-xs text-red-500 hover:text-red-600">Revoke</button>
                      </div>
                    </div>
                    <button className="w-full p-3 border border-dashed border-border rounded-lg text-xs text-muted-foreground hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors">
                      + Generate New Key
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>Appearance</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Theme</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setIsDark(false); localStorage.setItem('theme', 'light'); document.documentElement.classList.remove('dark'); }}
                      className={cn('flex-1 p-4 rounded-lg border-2 transition-colors', !isDark ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-border hover:border-muted-foreground/30')}
                    >
                      <Sun className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                      <div className="text-sm font-medium text-foreground">Light</div>
                    </button>
                    <button
                      onClick={() => { setIsDark(true); localStorage.setItem('theme', 'dark'); document.documentElement.classList.add('dark'); }}
                      className={cn('flex-1 p-4 rounded-lg border-2 transition-colors', isDark ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-border hover:border-muted-foreground/30')}
                    >
                      <Moon className="w-6 h-6 text-[#4F46E5] mx-auto mb-2" />
                      <div className="text-sm font-medium text-foreground">Dark</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Accent Color</h3>
                  <div className="flex gap-2">
                    {['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'].map(color => (
                      <button
                        key={color}
                        className={cn('w-8 h-8 rounded-full border-2 border-transparent transition-all', color === '#4F46E5' && 'border-foreground scale-110')}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Font Size</h3>
                  <div className="flex gap-2">
                    {['Small', 'Medium', 'Large'].map(size => (
                      <button
                        key={size}
                        className={cn('px-4 py-2 text-sm rounded-lg border transition-colors', size === 'Medium' ? 'border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5]' : 'border-border text-muted-foreground hover:bg-muted')}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>Billing & Subscription</h2>
              
              <div className="p-4 bg-[#4F46E5]/5 border border-[#4F46E5]/20 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">Pro Plan</h3>
                      <Badge className="bg-[#4F46E5] text-white text-[9px]">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">$29/month • Renews on Feb 15, 2025</p>
                  </div>
                  <button className="text-xs text-[#4F46E5] hover:underline">Manage Subscription</button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Payment Method</h3>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-[#1A1F71] rounded flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">VISA</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">•••• •••• •••• 4242</div>
                      <div className="text-xs text-muted-foreground">Expires 12/2026</div>
                    </div>
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Update</button>
                </div>

                <h3 className="text-sm font-semibold text-foreground pt-4">Billing History</h3>
                <div className="space-y-2">
                  {[
                    { date: 'Jan 15, 2025', amount: '$29.00', status: 'paid' },
                    { date: 'Dec 15, 2024', amount: '$29.00', status: 'paid' },
                    { date: 'Nov 15, 2024', amount: '$29.00', status: 'paid' },
                  ].map(({ date, amount, status }) => (
                    <div key={date} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-sm text-foreground">{date}</div>
                        <div className="text-xs text-muted-foreground">Pro Plan Subscription</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">{amount}</span>
                        <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500">{status}</Badge>
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Team Members</h2>
                <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer px-3 py-1.5 text-xs bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm">
                  <Users className="w-3.5 h-3.5" /> Invite Member
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'John Doe', email: 'john@company.com', role: 'Owner', initials: 'JD' },
                  { name: 'Jane Smith', email: 'jane@company.com', role: 'Admin', initials: 'JS' },
                  { name: 'Mike Johnson', email: 'mike@company.com', role: 'Member', initials: 'MJ' },
                ].map(({ name, email, role, initials }) => (
                  <div key={email} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-white text-sm font-bold">
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{name}</div>
                        <div className="text-xs text-muted-foreground">{email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={cn('text-[9px]', role === 'Owner' && 'bg-[#4F46E5]/10 text-[#4F46E5]', role === 'Admin' && 'bg-amber-500/10 text-amber-500', role === 'Member' && 'bg-muted text-muted-foreground')}>
                        {role}
                      </Badge>
                      {role !== 'Owner' && (
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}