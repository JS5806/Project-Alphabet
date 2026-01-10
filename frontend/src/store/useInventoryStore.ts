import { create } from 'zustand';

interface InventoryState {
  products: any[];
  isLoading: boolean;
  setProducts: (data: any[]) => void;
  updateStock: (id: string, qty: number, type: 'INBOUND' | 'OUTBOUND') => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  isLoading: false,
  setProducts: (data) => set({ products: data }),
  updateStock: async (id, qty, type) => {
    // Optimistic Update can be implemented here
    // But for 0% error requirement, we wait for server confirmation
    try {
      const response = await fetch(`/api/inventory/move`, {
        method: 'POST',
        body: JSON.stringify({ productId: id, amount: qty, type }),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      
      if (result.success) {
         // Refresh logic or partial state update
      }
    } catch (error) {
      console.error("Transaction Failed", error);
    }
  }
}));