// Usage tracking store with Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UsageRecord {
  id: string;
  timestamp: number;
  provider: string;
  model: string;
  taskType: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  success: boolean;
}

interface UsageStore {
  records: UsageRecord[];
  addRecord: (record: Omit<UsageRecord, 'id' | 'timestamp'>) => void;
  clearRecords: () => void;
  getTotalCost: () => number;
  getTotalCalls: () => number;
  getCostByProvider: () => Record<string, number>;
  getCostByModel: () => Record<string, number>;
  getCallsByTaskType: () => Record<string, number>;
  getRecordsInDateRange: (startDate: number, endDate: number) => UsageRecord[];
  getSavingsVsTraditional: () => number;
}

export const useUsageStore = create<UsageStore>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (record) => {
        const newRecord: UsageRecord = {
          ...record,
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };
        set((state) => ({
          records: [...state.records, newRecord],
        }));
      },

      clearRecords: () => set({ records: [] }),

      getTotalCost: () => {
        return get().records.reduce((sum, record) => sum + record.cost, 0);
      },

      getTotalCalls: () => {
        return get().records.length;
      },

      getCostByProvider: () => {
        const records = get().records;
        return records.reduce((acc, record) => {
          acc[record.provider] = (acc[record.provider] || 0) + record.cost;
          return acc;
        }, {} as Record<string, number>);
      },

      getCostByModel: () => {
        const records = get().records;
        return records.reduce((acc, record) => {
          const key = `${record.provider}/${record.model}`;
          acc[key] = (acc[key] || 0) + record.cost;
          return acc;
        }, {} as Record<string, number>);
      },

      getCallsByTaskType: () => {
        const records = get().records;
        return records.reduce((acc, record) => {
          acc[record.taskType] = (acc[record.taskType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      },

      getRecordsInDateRange: (startDate, endDate) => {
        return get().records.filter(
          (record) => record.timestamp >= startDate && record.timestamp <= endDate
        );
      },

      getSavingsVsTraditional: () => {
        // Traditional tools typically cost ~$0.15-0.25 per request on average
        // Our smart routing averages ~$0.03-0.05 per request
        // That's 70-90% savings
        const totalCalls = get().getTotalCalls();
        const actualCost = get().getTotalCost();
        const traditionalCost = totalCalls * 0.20; // Average $0.20 per call
        return traditionalCost - actualCost;
      },
    }),
    {
      name: 'codeforge-usage',
    }
  )
);
