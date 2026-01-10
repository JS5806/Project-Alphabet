import React from 'react';
import { useInventoryStore } from '../store/useInventoryStore';

// Designed for field workers wearing gloves: High contrast, large touch targets
export const QuickStockAction = ({ productId }) => {
  const { updateStock } = useInventoryStore();

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-center">Quick Stock Entry</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => updateStock(productId, 1, 'INBOUND')}
          className="h-24 bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-lg text-2xl font-black transition-all"
        >
          + 1 입고
        </button>
        <button
          onClick={() => updateStock(productId, 1, 'OUTBOUND')}
          className="h-24 bg-red-600 hover:bg-red-500 active:scale-95 rounded-lg text-2xl font-black transition-all"
        >
          - 1 출고
        </button>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm text-slate-400 mb-2">수량 직접 입력 (Barcode Scan Ready)</label>
        <input 
          type="number" 
          className="w-full h-16 bg-slate-800 border-2 border-slate-600 rounded-lg text-3xl px-4 text-center focus:border-blue-500 outline-none"
          placeholder="0"
        />
      </div>
    </div>
  );
};