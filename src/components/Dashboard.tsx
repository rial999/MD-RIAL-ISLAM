import { 
  TrendingUp, 
  Users, 
  Banknote, 
  Calendar,
  Layers
} from 'lucide-react';
import { calculateDashboardStats, formatBDT } from '../utils/formatters';

interface DashboardProps {
  data: any;
}

const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
  <div className="bg-[var(--slate-900)] p-6 rounded-2xl card-shadow border border-[var(--slate-800)] flex flex-col justify-between group hover:border-[var(--sky-500)]/30 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-[var(--slate-400)] uppercase tracking-widest leading-none">{title}</span>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      {subValue && <p className="text-xs font-semibold text-[var(--slate-400)] mt-1">{subValue}</p>}
    </div>
  </div>
);

export default function Dashboard({ data }: DashboardProps) {
  const stats = calculateDashboardStats(data.records);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Management Console | ড্যাশবোর্ড</h2>
          <p className="text-[var(--slate-400)] font-medium text-sm">Today: {new Date().toLocaleDateString('en-BD', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Entries | এন্ট্রি" 
          value={stats.today.entries} 
          icon={Layers} 
          color="bg-[var(--sky-500)]/10 text-[var(--sky-400)]" 
        />
        <StatCard 
          title="Work Amount | কাজের অংক" 
          value={formatBDT(stats.today.amount)} 
          icon={TrendingUp} 
          color="bg-green-500/10 text-green-400" 
        />
        <StatCard 
          title="Commission | কমিশন" 
          value={formatBDT(stats.today.commission)} 
          icon={Banknote} 
          color="bg-orange-500/10 text-orange-400" 
          subValue={`Net: ${formatBDT(stats.today.amount - stats.today.commission)}`}
        />
      </div>

      <div className="pt-4">
        <h2 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-[var(--sky-400)]" />
          Business Performance | এই মাস
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard 
            title="Total Work | মোট কাজ" 
            value={formatBDT(stats.month.amount)} 
            icon={Calendar} 
            color="bg-purple-500/10 text-purple-400" 
          />
          <StatCard 
            title="Total Commission | মোট কমিশন" 
            value={formatBDT(stats.month.commission)} 
            icon={Users} 
            color="bg-indigo-500/10 text-indigo-400" 
            subValue={`Revenue: ${formatBDT(stats.month.amount - stats.month.commission)}`}
          />
        </div>
      </div>
    </div>
  );
}
