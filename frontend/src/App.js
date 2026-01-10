import React, { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import { QueryClient, QueryClientProvider, useMutation } from 'react-query';

const queryClient = new QueryClient();

function InventoryManager() {
  const [logs, setLogs] = useState([]);

  const mutation = useMutation(async ({ barcode, type }) => {
    const response = await fetch('/api/inventory/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode, quantity: 1, type }),
    });
    return response.json();
  }, {
    onSuccess: (data) => {
      setLogs(prev => [data, ...prev].slice(0, 10));
      alert(`처리 완료: ${data.product.name}`);
    },
    onError: (err) => alert('에러 발생: ' + err.message)
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">스마트 재고 관리 (Core)</h1>
        <p className="text-gray-600">바코드 스캔을 통한 실시간 입출고 처리</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarcodeScanner 
          onScanSuccess={(barcode) => mutation.mutate({ barcode, type: 'IN' })}
        />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">최근 입출고 내역</h2>
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{log.product.name}</p>
                  <p className="text-xs text-gray-500">{log.product.barcode}</p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${log.updatedStock.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                   잔고: {log.updatedStock.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InventoryManager />
    </QueryClientProvider>
  );
}