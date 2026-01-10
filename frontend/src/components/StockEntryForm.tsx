import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const StockEntryForm = () => {
  const queryClient = useQueryClient();
  const [barcode, setBarcode] = useState('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation(async (formData: any) => {
    const res = await fetch('/api/stock/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error('입력 실패');
    return res.json();
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['stock-stats']);
      alert('성공적으로 등록되었습니다.');
      setBarcode('');
      barcodeInputRef.current?.focus();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    mutation.mutate({
      barcode: target.barcode.value,
      name: target.name.value,
      expiryDate: target.expiryDate.value,
      quantity: parseInt(target.quantity.value),
    });
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center">신규 재고 등록 (바코드 최적화)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">바코드 스캔</label>
          <input
            ref={barcodeInputRef}
            name="barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            autoFocus
            placeholder="바코드를 스캔하세요"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">제품명</label>
          <input name="name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">유통기한</label>
            <input type="date" name="expiryDate" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">수량</label>
            <input type="number" name="quantity" defaultValue="1" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border" />
          </div>
        </div>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {mutation.isLoading ? '처리 중...' : '재고 등록'}
        </button>
      </form>
    </div>
  );
};

export default StockEntryForm;