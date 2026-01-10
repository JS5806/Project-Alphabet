import React from 'react';
import { FixedSizeList as List } from 'react-window';

const VirtualInventoryList = ({ items }) => {
  // Using react-window for high-performance rendering of large datasets
  const Row = ({ index, style }) => (
    <div style={style} className="border-b flex items-center px-4 hover:bg-gray-50">
      <div className="w-1/4 font-medium">{items[index].sku}</div>
      <div className="w-2/4 text-gray-600">{items[index].name}</div>
      <div className="w-1/4 text-right">
        <span className={`px-2 py-1 rounded text-xs ${items[index].stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {items[index].stock} EA
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex bg-gray-100 p-4 font-bold text-sm text-gray-700">
        <div className="w-1/4">SKU</div>
        <div className="w-2/4">Product Name</div>
        <div className="w-1/4 text-right">Current Stock</div>
      </div>
      <List
        height={500}
        itemCount={items.length}
        itemSize={50}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualInventoryList;