import React, { useState } from 'react';
import { Save, User, Phone, Tag, DollarSign, Building2, StickyNote, Calendar } from 'lucide-react';
import { TestCategory } from '../types';

const InputField = ({ label, icon: Icon, required, ...props }: any) => (
  <div className="space-y-1.5 peer">
    <label className="text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest flex items-center gap-2 px-1">
      {Icon && <Icon size={12} className="text-[var(--sky-400)]" />}
      {label} {required && <span className="text-[var(--sky-400)]">*</span>}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-[var(--slate-950)] border border-[var(--slate-800)] focus:border-[var(--sky-500)] rounded-xl outline-none transition-all font-medium text-slate-100 placeholder:text-slate-700"
    />
  </div>
);

interface EntryFormProps {
  onSave: (record: any) => void;
}

export default function EntryForm({ onSave }: EntryFormProps) {
  const [formData, setFormData] = useState({
    agentName: '',
    agentPhone: '',
    category: TestCategory.BIOCHEMISTRY,
    testName: '',
    price: '',
    commission: '',
    diagnosticCenter: '',
    notes: '',
    entryDate: new Date().toISOString().split('T')[0]
  });

  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentName || !formData.agentPhone || !formData.testName || !formData.price || !formData.commission) {
      alert("Please fill all required fields");
      return;
    }

    onSave({
      ...formData,
      price: Number(formData.price),
      commission: Number(formData.commission)
    });

    setMessage('Record saved successfully!');
    setFormData({
      agentName: '',
      agentPhone: '',
      category: TestCategory.BIOCHEMISTRY,
      testName: '',
      price: '',
      commission: '',
      diagnosticCenter: '',
      notes: '',
      entryDate: new Date().toISOString().split('T')[0]
    });

    setTimeout(() => setMessage(''), 3000);
  };

  const handlePriceChange = (val: string) => {
    setFormData(prev => ({ 
      ...prev, 
      price: val,
      // Auto calculate 10% commission as a helper, user can override
      commission: val ? (Number(val) * 0.1).toString() : ''
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">New Lab Entry | নতুন এন্ট্রি</h2>
        <p className="text-[var(--slate-400)] font-medium">Register a test received from an agent</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--slate-900)] p-8 rounded-3xl card-shadow border border-[var(--slate-800)] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Agent Name | এজেন্টের নাম"
            icon={User}
            required
            value={formData.agentName}
            onChange={(e: any) => setFormData({ ...formData, agentName: e.target.value })}
            placeholder="Search or enter name"
          />
          <InputField
            label="Agent Phone | এজেন্টের ফোন"
            icon={Phone}
            required
            value={formData.agentPhone}
            onChange={(e: any) => setFormData({ ...formData, agentPhone: e.target.value })}
            placeholder="01XXX-XXXXXX"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest flex items-center gap-2 px-1">
              <Tag size={12} className="text-[var(--sky-400)]" />
              Category | বিভাগ <span className="text-[var(--sky-400)]">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as TestCategory })}
              className="w-full px-4 py-3 bg-[var(--slate-950)] border border-[var(--slate-800)] focus:border-[var(--sky-500)] rounded-xl outline-none transition-all font-medium text-slate-100 appearance-none cursor-pointer"
            >
              {Object.values(TestCategory).map(cat => (
                <option key={cat} value={cat} className="bg-[var(--slate-900)]">{cat}</option>
              ))}
            </select>
          </div>
          <InputField
            label="Test Name | টেস্টের নাম"
            required
            value={formData.testName}
            onChange={(e: any) => setFormData({ ...formData, testName: e.target.value })}
            placeholder="e.g. Blood Sugar, TSH"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Test Price | দাম (৳)"
            icon={DollarSign}
            required
            type="number"
            value={formData.price}
            onChange={(e: any) => handlePriceChange(e.target.value)}
            placeholder="0"
          />
          <InputField
            label="Commission | কমিশন (৳)"
            icon={DollarSign}
            required
            type="number"
            value={formData.commission}
            onChange={(e: any) => setFormData({ ...formData, commission: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Diagnostic Center | ডায়াগনস্টিক সেন্টার"
            icon={Building2}
            value={formData.diagnosticCenter}
            onChange={(e: any) => setFormData({ ...formData, diagnosticCenter: e.target.value })}
            placeholder="Optional"
          />
          <InputField
            label="Entry Date | তারিখ"
            icon={Calendar}
            type="date"
            required
            value={formData.entryDate}
            onChange={(e: any) => setFormData({ ...formData, entryDate: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[var(--slate-400)] uppercase tracking-widest flex items-center gap-2 px-1">
            <StickyNote size={12} className="text-[var(--sky-400)]" />
            Notes | নোট
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-[var(--slate-950)] border border-[var(--slate-800)] focus:border-[var(--sky-500)] rounded-xl outline-none transition-all font-medium text-slate-100 placeholder:text-slate-700 resize-none"
            placeholder="Any extra info..."
          />
        </div>

        {message && (
          <div className="p-4 bg-[var(--sky-500)]/10 text-[var(--sky-400)] rounded-xl text-center font-bold border border-[var(--sky-500)]/20 animate-pulse">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-[var(--sky-500)] hover:bg-[var(--sky-400)] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[var(--sky-500)]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Save size={20} />
          Save Record | সংরক্ষণ করুন
        </button>
      </form>
    </div>
  );
}
