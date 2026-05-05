import React, { useState } from 'react';
import { Microscope, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('pathobiz_password') || 'admin123';
    
    if (password === savedPassword) {
      localStorage.setItem('pathobiz_auth', 'true');
      onLogin();
    } else {
      setError('Incorrect password. Default: admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--slate-950)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--slate-900)] rounded-3xl shadow-2xl border border-[var(--slate-800)] overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex p-4 bg-[var(--sky-500)]/10 rounded-2xl text-[var(--sky-400)] mb-6 border border-[var(--sky-500)]/20">
            <Microscope size={48} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PathoBiz <span className="font-light">Pro</span></h1>
          <p className="text-[var(--slate-400)] font-medium">Senior Pathologist Management App</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-[var(--slate-400)] uppercase tracking-widest mb-2 px-1">Access Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--slate-400)] font-medium" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[var(--slate-950)] border border-[var(--slate-800)] focus:border-[var(--sky-500)] rounded-2xl outline-none transition-all text-white"
                placeholder="Enter password..."
                autoFocus
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-400 px-1 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[var(--sky-500)] hover:bg-[var(--sky-400)] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[var(--sky-500)]/20 transition-all active:scale-[0.98]"
          >
            Sign In | সাইন ইন
          </button>
          
          <div className="text-center">
            <p className="text-xs text-[var(--slate-400)] font-medium">Default password: admin123 | ডিফল্ট পাসওয়ার্ড: admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
