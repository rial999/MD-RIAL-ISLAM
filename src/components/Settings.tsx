import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  Lock, 
  ShieldCheck, 
  FileJson,
  Database,
  ArrowRight
} from 'lucide-react';

interface SettingsProps {
  data: any;
}

export default function Settings({ data }: SettingsProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMessage, setPassMessage] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }
    localStorage.setItem('pathobiz_password', password);
    setPassMessage('Password updated successfully!');
    setPassword('');
    setConfirmPassword('');
    setTimeout(() => setPassMessage(''), 3000);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (confirm('Restoring data will overwrite your current records. Continue?')) {
        data.restoreData(file);
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Settings | সেটিংস</h2>
        <p className="text-[var(--slate-400)] font-medium">Manage security and data backups</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Section */}
        <section className="bg-[var(--slate-900)] p-8 rounded-3xl card-shadow border border-[var(--slate-800)] space-y-6 flex flex-col h-full">
          <div className="flex items-center gap-4 border-b border-[var(--slate-800)] pb-4">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Security Lock</h3>
              <p className="text-xs text-[var(--slate-400)] font-medium">Change your access password</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest px-1">New Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 bg-[var(--slate-950)] border border-[var(--slate-800)] focus:border-red-500 rounded-2xl outline-none transition-all font-medium text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest px-1">Confirm Password</label>
              <input 
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-3 bg-[var(--slate-950)] border border-[var(--slate-800)] focus:border-red-500 rounded-2xl outline-none transition-all font-medium text-white"
              />
            </div>

            {passMessage && <p className="text-sm text-green-400 font-bold text-center py-2 animate-pulse">{passMessage}</p>}

            <div className="pt-4 mt-auto">
              <button 
                type="submit"
                className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-[0.98]"
              >
                <ShieldCheck size={20} />
                Update Security
              </button>
            </div>
          </form>
        </section>

        {/* Data Management */}
        <section className="bg-[var(--slate-900)] p-8 rounded-3xl card-shadow border border-[var(--slate-800)] space-y-6 h-full flex flex-col">
          <div className="flex items-center gap-4 border-b border-[var(--slate-800)] pb-4">
            <div className="p-3 bg-[var(--sky-500)]/10 text-[var(--sky-400)] rounded-2xl border border-[var(--sky-500)]/20">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Data & Backup</h3>
              <p className="text-xs text-[var(--slate-400)] font-medium">Protect your business records</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="p-6 bg-[var(--slate-950)] rounded-2xl border border-[var(--slate-800)]">
              <p className="text-xs font-bold text-[var(--sky-400)] uppercase tracking-widest mb-2 px-1">System Capacity</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-black text-white">{data.records.length}</p>
                  <p className="text-[10px] font-bold text-[var(--slate-400)] uppercase tracking-wider">Total Records Saved</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-400">Stable</p>
                  <p className="text-[10px] font-bold text-[var(--slate-400)] uppercase tracking-wider">Health Status</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                onClick={data.backupData}
                className="group w-full p-4 border border-[var(--slate-800)] bg-[var(--slate-950)] rounded-2xl flex items-center justify-between hover:border-[var(--sky-500)]/50 hover:bg-[var(--slate-800)]/30 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-[var(--slate-900)] rounded-xl border border-[var(--slate-800)]"><Download size={20} className="text-[var(--slate-400)] group-hover:text-[var(--sky-400)]" /></div>
                   <div className="text-left">
                     <p className="font-bold text-white">Download Backup</p>
                     <p className="text-xs text-[var(--slate-400)] font-medium">Export all records to JSON</p>
                   </div>
                </div>
                <ArrowRight size={18} className="text-[var(--slate-800)] group-hover:text-[var(--sky-400)]" />
              </button>

              <label className="group w-full p-4 border border-[var(--slate-800)] bg-[var(--slate-950)] rounded-2xl flex items-center justify-between hover:border-green-500/50 hover:bg-[var(--slate-800)]/30 transition-all cursor-pointer active:scale-[0.99]">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-[var(--slate-900)] rounded-xl border border-[var(--slate-800)]"><Upload size={20} className="text-[var(--slate-400)] group-hover:text-green-400" /></div>
                   <div className="text-left">
                     <p className="font-bold text-white">Restore Data</p>
                     <p className="text-xs text-[var(--slate-400)] font-medium">Upload a previously saved JSON</p>
                   </div>
                </div>
                <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
                <FileJson size={18} className="text-[var(--slate-800)] group-hover:text-green-400" />
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
