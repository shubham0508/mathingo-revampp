"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ToolbarButton = ({
  active = false,
  disabled = false,
  onClick,
  icon,
  title,
  className = '',
  sendButton
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
              flex items-center justify-center rounded text-sm p-2 transition-colors
              ${disabled ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : ''}
              ${active ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}
              ${className}
            `}
          >
            {icon}
          </button>
        </TooltipTrigger>

        <TooltipContent side="top" align="center" sideOffset={6} className="bg-black">
           <span>{title}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolbarButton;
