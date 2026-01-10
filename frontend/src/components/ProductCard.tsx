import React from 'react';
import { getExpiryStatus, getStatusColor } from '../utils/dateHelper';

interface ProductProps {
  product: {
    name: string;
    brand: string;
    finalExpiryDate: string;
  };
}

export const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const { status, daysLeft } = getExpiryStatus(product.finalExpiryDate);

  return (
    <div className="p-4 border rounded-lg shadow-sm flex items-center justify-between bg-white">
      <div>
        <h3 className="font-bold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.brand}</p>
        <p className="text-xs mt-1">Expires: {new Date(product.finalExpiryDate).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(status)}`}>
          {status === 'EXPIRED' ? 'Expired' : `D-${daysLeft}`}
        </div>
      </div>
    </div>
  );
};