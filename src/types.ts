/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TestCategory {
  BIOCHEMISTRY = "Biochemistry",
  HEMATOLOGY = "Hematology",
  HORMONE = "Hormone",
  IMMUNOLOGY = "Immunology",
  SEROLOGY = "Serology",
  OTHERS = "Others"
}

export interface PathoRecord {
  id: string;
  agentName: string;
  agentPhone: string;
  category: TestCategory;
  testName: string;
  price: number;
  commission: number;
  diagnosticCenter?: string;
  notes?: string;
  entryDate: string; // ISO format
  createdAt: string; // ISO format
}

export interface AgentStats {
  name: string;
  phone: string;
  totalValue: number;
  totalCommission: number;
  lastActivity: string;
  recordCount: number;
}

export interface DashboardStats {
  today: {
    entries: number;
    amount: number;
    commission: number;
  };
  month: {
    amount: number;
    commission: number;
  };
}
