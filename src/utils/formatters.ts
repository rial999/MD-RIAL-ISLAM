import { format, isSameDay, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { PathoRecord, TestCategory } from '../types';

export const formatBDT = (amount: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳');
};

export const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd-MM-yyyy');
};

export const calculateDashboardStats = (records: PathoRecord[]) => {
  const now = new Date();
  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);

  const stats = {
    today: { entries: 0, amount: 0, commission: 0 },
    month: { amount: 0, commission: 0 }
  };

  records.forEach(rec => {
    const recDate = parseISO(rec.entryDate);
    
    if (isSameDay(recDate, now)) {
      stats.today.entries++;
      stats.today.amount += rec.price;
      stats.today.commission += rec.commission;
    }

    if (isWithinInterval(recDate, { start: startMonth, end: endMonth })) {
      stats.month.amount += rec.price;
      stats.month.commission += rec.commission;
    }
  });

  return stats;
};

export const getAgentStats = (records: PathoRecord[]) => {
  const agentsMap = new Map<string, any>();

  records.forEach(rec => {
    const key = `${rec.agentName}_${rec.agentPhone}`;
    const existing = agentsMap.get(key) || {
      name: rec.agentName,
      phone: rec.agentPhone,
      totalValue: 0,
      totalCommission: 0,
      lastActivity: rec.entryDate,
      recordCount: 0
    };

    existing.totalValue += rec.price;
    existing.totalCommission += rec.commission;
    existing.recordCount++;
    if (new Date(rec.entryDate) > new Date(existing.lastActivity)) {
      existing.lastActivity = rec.entryDate;
    }

    agentsMap.set(key, existing);
  });

  return Array.from(agentsMap.values());
};
