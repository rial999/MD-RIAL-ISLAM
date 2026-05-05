import { useState } from 'react';
import { 
  FileDown, 
  Table, 
  File as FileIcon, 
  Calendar, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { PathoRecord } from '../types';
import { formatDate, formatBDT } from '../utils/formatters';
import { exportToExcel, exportToPDF } from '../utils/export';
import { startOfDay, startOfMonth, isSameDay, isSameMonth } from 'date-fns';

interface ReportsProps {
  records: PathoRecord[];
}

export default function Reports({ records }: ReportsProps) {
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredRecords = records.filter(r => {
    const d = new Date(selectedDate);
    const recD = new Date(r.entryDate);
    return reportType === 'daily' 
      ? isSameDay(recD, d) 
      : isSameMonth(recD, d);
  }).sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());

  const totals = filteredRecords.reduce((acc, r) => ({
    count: acc.count + 1,
    amount: acc.amount + r.price,
    commission: acc.commission + r.commission
  }), { count: 0, amount: 0, commission: 0 });

  const agentBreakdown = filteredRecords.reduce((acc: any, r) => {
    const key = r.agentName;
    if (!acc[key]) acc[key] = { name: r.agentName, count: 0, amount: 0, commission: 0 };
    acc[key].count++;
    acc[key].amount += r.price;
    acc[key].commission += r.commission;
    return acc;
  }, {});

  const handleExport = (format: 'pdf' | 'excel') => {
    const title = `${reportType === 'daily' ? 'Daily' : 'Monthly'} Report - ${selectedDate}`;
    if (format === 'pdf') {
      exportToPDF(filteredRecords, title);
    } else {
      exportToExcel(filteredRecords, title);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Financial Reports | রিপোর্ট</h2>
          <p className="text-[var(--slate-400)] font-medium">Export and analyze your business data</p>
        </div>
        
        <div className="flex gap-2 bg-[var(--slate-900)] p-1 rounded-2xl border border-[var(--slate-800)] shadow-sm self-start md:self-end">
          <button 
            onClick={() => setReportType('daily')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${reportType === 'daily' ? 'bg-[var(--sky-500)] text-white shadow-lg shadow-[var(--sky-500)]/20' : 'text-[var(--slate-400)] hover:text-slate-100'}`}
          >
            Daily
          </button>
          <button 
            onClick={() => setReportType('monthly')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${reportType === 'monthly' ? 'bg-[var(--sky-500)] text-white shadow-lg shadow-[var(--sky-500)]/20' : 'text-[var(--slate-400)] hover:text-slate-100'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="bg-[var(--slate-900)] p-6 rounded-3xl card-shadow border border-[var(--slate-800)] flex flex-wrap items-center gap-6">
        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label className="text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest px-1">Select {reportType === 'daily' ? 'Date' : 'Month'}</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--slate-400)]" size={18} />
            <input 
              type={reportType === 'daily' ? 'date' : 'month'}
              value={selectedDate.slice(0, reportType === 'daily' ? 10 : 7)}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--slate-950)] border border-[var(--slate-800)] focus:border-[var(--sky-500)] rounded-2xl outline-none transition-all font-medium text-white"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--slate-800)] text-white rounded-2xl font-bold hover:bg-[var(--slate-700)] transition-all active:scale-[0.98] border border-[var(--slate-700)]"
          >
            <FileIcon size={18} /> PDF
          </button>
          <button 
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-6 py-3 bg-green-600/10 text-green-400 rounded-2xl font-bold hover:bg-green-600/20 transition-all active:scale-[0.98] border border-green-500/20"
          >
            <Table size={18} /> Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--slate-900)] p-6 rounded-2xl border border-[var(--slate-800)] shadow-sm">
          <p className="text-[10px] font-extrabold text-[var(--slate-400)] uppercase tracking-[0.2em] mb-1">Total Tests</p>
          <p className="text-3xl font-black text-white">{totals.count}</p>
        </div>
        <div className="bg-[var(--slate-900)] p-6 rounded-2xl border border-[var(--slate-800)] shadow-sm">
          <p className="text-[10px] font-extrabold text-[var(--sky-400)] uppercase tracking-[0.2em] mb-1">Total Amount</p>
          <p className="text-3xl font-black text-[var(--sky-400)]">{formatBDT(totals.amount)}</p>
        </div>
        <div className="bg-[var(--slate-900)] p-6 rounded-2xl border border-[var(--slate-800)] shadow-sm">
          <p className="text-[10px] font-extrabold text-orange-400 uppercase tracking-[0.2em] mb-1">Commission</p>
          <p className="text-3xl font-black text-orange-400">{formatBDT(totals.commission)}</p>
        </div>
      </div>

      <div className="bg-[var(--slate-900)] rounded-3xl card-shadow border border-[var(--slate-800)] overflow-hidden">
        <div className="p-6 border-b border-[var(--slate-800)] flex items-center justify-between">
          <h3 className="font-bold text-white text-lg flex items-center gap-2 text-sm uppercase tracking-wider">
            <Filter size={16} className="text-[var(--sky-400)]" />
            Agent Breakdown
          </h3>
          <span className="text-[10px] font-bold bg-[var(--slate-950)] px-3 py-1 rounded-full text-[var(--slate-400)] uppercase tracking-widest border border-[var(--slate-800)]">
            Sorted by Amount
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--slate-950)]/50">
                <th className="px-6 py-4 text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest">Agent Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest">Count</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest">Total Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--slate-800)]">
              {Object.values(agentBreakdown).sort((a: any, b: any) => b.amount - a.amount).map((agent: any) => (
                <tr key={agent.name} className="hover:bg-slate-500/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-white">{agent.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[var(--slate-400)]">{agent.count} tests</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[var(--sky-400)]">{formatBDT(agent.amount)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-green-400">{formatBDT(agent.commission)}</span>
                  </td>
                </tr>
              ))}
              {Object.keys(agentBreakdown).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[var(--slate-400)] font-medium italic">
                    No data available for the selected period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
