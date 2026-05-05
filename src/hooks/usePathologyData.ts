import { useState, useEffect } from 'react';
import { PathoRecord } from '../types';

const STORAGE_KEY = 'pathobiz_records';

export const usePathologyData = () => {
  const [records, setRecords] = useState<PathoRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }
  }, []);

  const saveRecords = (newRecords: PathoRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
  };

  const addRecord = (record: Omit<PathoRecord, 'id' | 'createdAt'>) => {
    const newRecord: PathoRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveRecords([...records, newRecord]);
  };

  const updateRecord = (id: string, updates: Partial<PathoRecord>) => {
    const newRecords = records.map(r => r.id === id ? { ...r, ...updates } : r);
    saveRecords(newRecords);
  };

  const deleteRecord = (id: string) => {
    saveRecords(records.filter(r => r.id !== id));
  };

  const backupData = () => {
    const data = JSON.stringify(records);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pathobiz_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const restoreData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          const imported = JSON.parse(content);
          if (Array.isArray(imported)) {
            saveRecords(imported);
          }
        } catch (e) {
          alert("Invalid backup file");
        }
      }
    };
    reader.readAsText(file);
  };

  return {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
    backupData,
    restoreData,
  };
};
