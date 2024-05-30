import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterState {
  count: number;
  increase: (by: number) => void;
}

export const useCounterStore = create<CounterState>()(
  devtools((set) => ({
    count: 0,
    increase: (by) => set((state) => ({ count: state.count + by })),
  })),
);
