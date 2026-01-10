import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BarcodeScanner = ({ onScanSuccess }) => {
  const [manualBarcode, setManualBarcode] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    // 1) 웹캠 기반 스캐너 초기화
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 150 },
    });

    scanner.render((decodedText) => {
      onScanSuccess(decodedText);
    }, (error) => {
      // console.warn(error);
    });

    return () => scanner.clear();
  }, [onScanSuccess]);

  // 하드웨어 스캐너의 'Enter' 이벤트가 Form 전송을 유발하지 않도록 방어
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (manualBarcode) {
        onScanSuccess(manualBarcode);
        setManualBarcode('');
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">바코드 스캔 (입/출고)</h2>
      <div id="reader" className="mb-4"></div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">수동 입력 또는 스캐너</label>
        <input
          type="text"
          value={manualBarcode}
          onChange={(e) => setManualBarcode(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="바코드를 입력하세요"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
};

export default BarcodeScanner;