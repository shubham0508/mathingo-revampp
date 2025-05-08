import { MATH_KEYBOARD_TABS } from '@/config/constant';
import React from 'react';

const MathKeyboardTab = ({ activeTab, setActiveTab }) => (
  <div className="flex overflow-x-auto border-b scrollbar-hide">
    {Object.entries(MATH_KEYBOARD_TABS).map(([key, { icon, label }]) => (
      <button
        key={key}
        className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
          activeTab === key
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab(key)}
        aria-label={label}
      >
        {icon} {key}
      </button>
    ))}
  </div>
);

export default MathKeyboardTab;
