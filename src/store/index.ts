import { create } from "zustand";

export const useStore = create((set) => ({
  stack: {},
  flow: {},
  stepFlow: {},
  setStack: (params: any) => set({ stack: params }),
  setFlow: (params: any) => set({ flow: params }),
  setStepFlow: (params: any) => set({ stepFlow: params }),
}));
