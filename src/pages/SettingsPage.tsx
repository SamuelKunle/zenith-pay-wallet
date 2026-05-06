import { ArrowLeft, Moon, Sun, Monitor, ChevronRight, Globe, Bell, Lock, Eye, Fingerprint, Smartphone, Trash2, FileText, Info, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center gap-3 px-5 py-3">
          <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary md:hidden">
            <ArrowLeft className="h-5 w-5 text-foreground" strokeWidth={2} />
          </Link>
          <h1 className="text-[16px] font-extrabold text-foreground">Settings</h1>
        </div>
      </header>

      <div className="px-5 py-5 md:px-8 space-y-5">
        {/* Appearance */}
        <div className="space-y-2 animate-slide-up">
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Appearance</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden p-4">
            <p className="text-[13px] font-bold text-foreground mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`flex flex-col items-center gap-2 rounded-xl py-4 px-3 transition-all ${
                      isActive
                        ? "bg-primary/10 ring-2 ring-primary shadow-sm"
                        : "bg-secondary hover:bg-muted"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                      strokeWidth={isActive ? 2.2 : 1.6}
                    />
                    <span className={`text-[12px] font-bold ${isActive ? "text-primary" : "text-foreground/70"}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Notifications</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border/50">
            <SettingToggle icon={Bell} label="Push Notifications" sub="Receive push alerts" value={pushNotifs} onChange={setPushNotifs} bg="bg-primary/10" color="text-primary" />
            <SettingToggle icon={MessageSquare} label="Email Notifications" sub="Transaction receipts & updates" value={emailNotifs} onChange={setEmailNotifs} bg="bg-[hsl(225_55%_92%)]" color="text-[hsl(225_60%_42%)]" />
            <SettingToggle icon={Smartphone} label="SMS Notifications" sub="Text alerts for transactions" value={smsNotifs} onChange={setSmsNotifs} bg="bg-accent/12" color="text-accent-foreground" />
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Security & Privacy</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border/50">
            <SettingToggle icon={Fingerprint} label="Biometric Login" sub="Use fingerprint or Face ID" value={biometric} onChange={setBiometric} bg="bg-success/10" color="text-success" />
            <SettingToggle icon={Eye} label="Hide Balance" sub="Mask balance on home screen" value={hideBalance} onChange={setHideBalance} bg="bg-[hsl(280_50%_92%)]" color="text-[hsl(280_55%_42%)]" />
            <SettingLink icon={Lock} label="Change PIN" sub="Update your transaction PIN" bg="bg-warning/12" color="text-warning" />
            <SettingLink icon={Lock} label="Change Password" sub="Update login password" bg="bg-destructive/10" color="text-destructive" />
          </div>
        </div>

        {/* General */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">General</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden divide-y divide-border/50">
            <SettingLink icon={Globe} label="Language" sub="English" bg="bg-[hsl(225_55%_92%)]" color="text-[hsl(225_60%_42%)]" />
            <SettingLink icon={FileText} label="Terms & Privacy" sub="Legal documents" bg="bg-secondary" color="text-secondary-foreground" />
            <SettingLink icon={Info} label="About Zenith Pay" sub="v1.0.0" bg="bg-secondary" color="text-secondary-foreground" />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Danger Zone</h3>
          <div className="rounded-2xl bg-card shadow-card overflow-hidden">
            <button className="flex items-center gap-3 px-4 py-3.5 w-full hover:bg-destructive/5 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <Trash2 className="h-[18px] w-[18px] text-destructive" strokeWidth={1.8} />
              </div>
              <div className="text-left flex-1">
                <p className="text-[13px] font-bold text-destructive">Delete Account</p>
                <p className="text-[11px] font-medium text-muted-foreground">Permanently remove your account</p>
              </div>
              <ChevronRight className="h-4 w-4 text-foreground/20" />
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] font-semibold text-foreground/25 py-4 tracking-wide">PAYNAIJA v1.0.0 • MADE WITH ❤️ IN LAGOS</p>
      </div>
    </div>
  );
};

function SettingToggle({ icon: Icon, label, sub, value, onChange, bg, color }: {
  icon: any; label: string; sub: string; value: boolean; onChange: (v: boolean) => void; bg: string; color: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-[18px] w-[18px] ${color}`} strokeWidth={1.8} />
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-bold text-foreground">{label}</p>
        <p className="text-[11px] font-medium text-muted-foreground">{sub}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function SettingLink({ icon: Icon, label, sub, bg, color }: {
  icon: any; label: string; sub: string; bg: string; color: string;
}) {
  return (
    <button className="flex items-center gap-3 px-4 py-3.5 w-full hover:bg-muted/40 transition-colors">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-[18px] w-[18px] ${color}`} strokeWidth={1.8} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-[13px] font-bold text-foreground">{label}</p>
        <p className="text-[11px] font-medium text-muted-foreground">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-foreground/20" />
    </button>
  );
}

export default SettingsPage;
