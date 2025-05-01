import React from 'react';
import { Button } from '@/components/ui/button';

const ToolbarButton = ({
  active,
  onClick,
  disabled,
  icon,
  title,
  highlight = false,
}) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className={`rounded-full p-2 hover:bg-gray-200 ${
      active ? 'bg-gray-200' : ''
    } ${highlight ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-600'}`}
    disabled={disabled}
    title={title}
  >
    {React.cloneElement(icon, {
      className: `w-5 h-5 ${active ? 'text-gray-900' : ''}`,
    })}
  </Button>
);

export default ToolbarButton;
