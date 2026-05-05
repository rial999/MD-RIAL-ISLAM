import { useState } from 'react';
import { Search, Phone, Calendar, User, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { getAgentStats, formatBDT, formatDate } from '../utils/formatters';
import { PathoRecord } from '../types';

interface AgentHistoryProps {
  records: PathoRecord[];
}

export default function AgentHistory({ records }: AgentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const agentStats = getAgentStats(records);

  const filteredAgents = agentStats.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.includes(searchTerm)
  );

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agentRecords = records.filter(r => 
    selectedAgent ? `${r.agentName}_${r.agentPhone}` === selectedAgent : false
  ).sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Agent Database | ইতিহাস</h2>
        <p className="text-[var(--slate-400)] font-medium">Track performance and history by agent</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--slate-400)]" size={20} />
        <input
          type="text"
          placeholder="Search by agent name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-[var(--slate-900)] rounded-2xl border border-[var(--slate-800)] shadow-sm outline-none focus:border-[var(--sky-500)] transition-all font-medium text-white placeholder:text-slate-700"
        />
      </div>

      {!selectedAgent ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <button
              key={`${agent.name}_${agent.phone}`}
              onClick={() => setSelectedAgent(`${agent.name}_${agent.phone}`)}
              className="bg-[var(--slate-900)] p-6 rounded-3xl card-shadow border border-[var(--slate-800)] text-left hover:border-[var(--sky-500)]/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[var(--sky-500)]/10 text-[var(--sky-400)] rounded-2xl group-hover:bg-[var(--sky-500)] group-hover:text-white transition-colors font-bold">
                  {agent.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[var(--slate-400)] uppercase tracking-widest leading-none mb-1">Last Active</p>
                  <p className="text-sm font-bold text-slate-200">{formatDate(agent.lastActivity)}</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
              <div className="flex items-center gap-2 text-[var(--slate-400)] mb-6 font-medium text-sm">
                <Phone size={14} />
                {agent.phone}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--slate-800)]">
                <div>
                  <p className="text-[10px] font-bold text-[var(--slate-400)] uppercase tracking-widest mb-0.5">Total Value</p>
                  <p className="text-lg font-bold text-[var(--sky-400)]">{formatBDT(agent.totalValue)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--slate-400)] uppercase tracking-widest mb-0.5">Commission</p>
                  <p className="text-lg font-bold text-green-400">{formatBDT(agent.totalCommission)}</p>
                </div>
              </div>
            </button>
          ))}
          
          {filteredAgents.length === 0 && (
            <div className="col-span-full py-12 text-center text-[var(--slate-400)] font-medium">
              No agents found matching your search.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedAgent(null)}
            className="text-[var(--sky-400)] font-bold hover:underline mb-2 flex items-center gap-2 text-sm"
          >
            ← Back to Agent List
          </button>
          
          <div className="bg-[var(--slate-900)] p-8 rounded-3xl card-shadow border border-[var(--slate-800)] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{agentRecords[0]?.agentName}</h1>
              <p className="text-[var(--slate-400)] font-bold flex items-center gap-2 mt-1">
                <Phone size={16} /> {agentRecords[0]?.agentPhone}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-[var(--slate-950)] px-6 py-3 rounded-2xl border border-[var(--slate-800)]">
                <p className="text-[10px] font-extrabold text-[var(--sky-400)] uppercase tracking-[0.2em] mb-1">Total Work</p>
                <p className="text-xl font-black text-white">{formatBDT(agentRecords.reduce((acc, r) => acc + r.price, 0))}</p>
              </div>
              <div className="bg-[var(--slate-950)] px-6 py-3 rounded-2xl border border-[var(--slate-800)]">
                <p className="text-[10px] font-extrabold text-green-400 uppercase tracking-[0.2em] mb-1">Earned Comm</p>
                <p className="text-xl font-black text-white">{formatBDT(agentRecords.reduce((acc, r) => acc + r.commission, 0))}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--slate-900)] rounded-3xl card-shadow border border-[var(--slate-800)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--slate-950)]/50 border-b border-[var(--slate-800)]">
                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest">Test details</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest">Pricing</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--slate-800)]">
                  {agentRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-500/5 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-bold text-white">{formatDate(rec.entryDate)}</p>
                        <p className="text-xs text-[var(--slate-400)] font-medium">{rec.diagnosticCenter || 'Direct'}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-200">{rec.testName}</p>
                        <span className="text-[10px] px-2 py-0.5 bg-[var(--sky-500)]/10 text-[var(--sky-400)] rounded-full font-bold uppercase border border-[var(--sky-500)]/20">{rec.category}</span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-[var(--sky-400)]">{formatBDT(rec.price)}</p>
                        <p className="text-xs text-green-400 font-bold">Comm: {formatBDT(rec.commission)}</p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-[var(--slate-400)] hover:text-white">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
