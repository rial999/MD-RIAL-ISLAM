import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  FileText, 
  Settings as SettingsIcon,
  LogOut,
  Microscope
} from 'lucide-react';
import { usePathologyData } from './hooks/usePathologyData';
import Dashboard from './components/Dashboard';
import EntryForm from './components/EntryForm';
import AgentHistory from './components/AgentHistory';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';

type Tab = 'dashboard' | 'entry' | 'history' | 'reports' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const data = usePathologyData();

  useEffect(() => {
    const auth = localStorage.getItem('pathobiz_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('pathobiz_auth');
    setIsAuthenticated(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'entry', label: 'New Entry', icon: PlusCircle },
    { id: 'history', label: 'Agent History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--slate-950)] text-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[var(--slate-900)] border-r border-[var(--slate-800)]">
        <div className="p-6 flex flex-col gap-1 border-b border-[var(--slate-800)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--sky-500)] rounded-lg text-white">
              <Microscope size={24} />
            </div>
            <h1 className="font-bold text-lg leading-tight text-[var(--sky-400)]">PathoBiz <span className="font-light">Pro</span></h1>
          </div>
          <p className="text-[10px] text-[var(--slate-400)] font-medium uppercase tracking-[0.1em] mt-1">পেশাদার প্যাথলজি ম্যানেজমেন্ট</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === item.id 
                ? 'bg-[var(--sky-500)]/10 text-[var(--sky-400)] border border-[var(--sky-500)]/20' 
                : 'text-[var(--slate-400)] hover:bg-[var(--slate-800)]/50 hover:text-slate-100'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-[var(--slate-800)]">
          <p className="text-[10px] text-[var(--slate-400)] uppercase tracking-widest mb-1">Logged in as</p>
          <p className="text-sm font-semibold truncate mb-4 text-slate-200">Senior Pathologist</p>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-sm font-bold"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Mobile Only */}
        <header className="md:hidden bg-[var(--slate-900)] border-b border-[var(--slate-800)] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Microscope size={24} className="text-[var(--sky-400)]" />
            <span className="font-bold text-lg text-[var(--sky-400)]">PathoBiz <span className="font-light">Pro</span></span>
          </div>
          <button onClick={handleLogout} className="p-2 text-[var(--slate-400)]">
            <LogOut size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'dashboard' && <Dashboard data={data} />}
                {activeTab === 'entry' && <EntryForm onSave={(rec) => data.addRecord(rec)} />}
                {activeTab === 'history' && <AgentHistory records={data.records} />}
                {activeTab === 'reports' && <Reports records={data.records} />}
                {activeTab === 'settings' && <Settings data={data} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Nav - Mobile Only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--slate-900)] border-t border-[var(--slate-800)] flex justify-around p-2 z-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center gap-1 p-2 min-w-[64px] border-t-2 transition-all ${
                activeTab === item.id ? 'text-[var(--sky-400)] border-[var(--sky-400)]' : 'text-[var(--slate-400)] border-transparent'
              }`}
            >
              <item.icon size={18} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
