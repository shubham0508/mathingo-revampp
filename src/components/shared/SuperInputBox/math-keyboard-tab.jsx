import { MATH_KEYBOARD_TABS } from '@/config/constant';

const MathKeyboardTab = ({ activeTab, setActiveTab }) => (
  <div className="flex overflow-x-auto border-b scrollbar-hide bg-gray-100 p-1 px-4 rounded-md justify-evenly">
    {Object.entries(MATH_KEYBOARD_TABS).map(([key, { icon, label }]) => {
      const isActive = activeTab === key;
      return (
        <button
          key={key}
          className={`px-4 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap rounded-md border transition-colors
            ${isActive
              ? 'bg-white text-primary border-primary'
              : 'bg-transparent text-gray-500 hover:text-primary border-transparent'
            }`}
          onClick={() => setActiveTab(key)}
          aria-label={label}
        >
          {key}
        </button>
      );
    })}
  </div>
);

export default MathKeyboardTab;
