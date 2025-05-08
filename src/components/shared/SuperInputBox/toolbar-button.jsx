import React from 'react';

const ToolbarButton = ({
  active,
  onClick,
  disabled,
  icon,
  title,
  highlight,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`
      relative flex items-center justify-center w-8 h-8 rounded-lg
      transition-all duration-200 focus:outline-none 
      ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      ${
        highlight
          ? 'text-white shadow-md hover:shadow-lg'
          : 'hover:shadow-sm'
      }
      ${className}
    `}
    title={title}
    aria-label={title}
  >
    {icon}
  </button>
);

export default ToolbarButton;
