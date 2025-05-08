import React from 'react';

const MathKey = ({ symbol, onClick, display }) => (
  <button
    className="h-12 flex items-center justify-center border rounded-lg bg-white hover:bg-blue-50 transition-colors border-gray-200 shadow-sm"
    onClick={onClick}
  >
    <span className="text-sm font-medium text-gray-700 whitespace-pre-line">
      {display || symbol}
    </span>
  </button>
);

export default MathKey;
