import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MATH_KEYBOARD_TABS } from '@/config/constant';

const MathKeyboardDropdown = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full px-4 py-3 text-sm bg-blue-600 text-white flex items-center justify-between font-medium rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          {MATH_KEYBOARD_TABS[activeTab].icon} {activeTab}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute w-full bg-white border rounded-b-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {Object.entries(MATH_KEYBOARD_TABS).map(([key, { icon }]) => (
            <button
              key={key}
              className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 ${
                activeTab === key
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
              onClick={() => {
                setActiveTab(key);
                setIsOpen(false);
              }}
            >
              {icon} {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MathKeyboardDropdown;
