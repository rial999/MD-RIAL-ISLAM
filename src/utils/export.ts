import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { PathoRecord } from '../types';
import { formatDate, formatBDT } from './formatters';

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToExcel = (records: PathoRecord[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(records.map(r => ({
    'Date': formatDate(r.entryDate),
    'Agent Name': r.agentName,
    'Phone': r.agentPhone,
    'Category': r.category,
    'Test Name': r.testName,
    'Price': r.price,
    'Commission': r.commission,
    'Diagnostic Center': r.diagnosticCenter || '',
    'Notes': r.notes || ''
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Records");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (records: PathoRecord[], title: string) => {
  const doc = new jsPDF();
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${formatDate(new Date())}`, 14, 22);

  const tableData = records.map(r => [
    formatDate(r.entryDate),
    r.agentName,
    r.category,
    r.testName,
    r.price,
    r.commission
  ]);

  doc.autoTable({
    startY: 25,
    head: [['Date', 'Agent', 'Category', 'Test', 'Price (BDT)', 'Comm (BDT)']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });

  doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
