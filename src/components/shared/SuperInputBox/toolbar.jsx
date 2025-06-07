import React from 'react';
import {
  Type,
  Upload,
  Camera,
  Calculator,
  Trash2,
  SendHorizontal,
  Loader2,
} from 'lucide-react';
import { MODES } from '@/config/constant';
import ToolbarButton from './toolbar-button';

const Toolbar = ({
  mode,
  setMode,
  text,
  drawingData,
  files,
  disabled,
  isMobile,
  triggerFileInput,
  triggerCameraInput,
  toggleMathKeyboard,
  showMathKeyboard,
  handleClear,
  handleSubmit,
  isProcessing,
}) => {
  const isTextInputDisabled = disabled || files.length > 0 || isProcessing;
  const isFileUploadDisabled =
    disabled || mode === MODES.DRAW || text.trim().length > 0 || isProcessing;

  return (
    <div className="px-3 py-2 flex justify-between items-center bg-white rounded-b-md">
      <div className="flex items-center gap-1">
        <ToolbarButton
          active={mode === MODES.TEXT}
          onClick={() => setMode(MODES.TEXT)}
          disabled={isTextInputDisabled}
          icon={<Type className="w-4 h-4" />}
          title="Text Input"
        />

        <ToolbarButton
          active={false}
          onClick={() => triggerFileInput()}
          disabled={isFileUploadDisabled}
          icon={<Upload className="w-4 h-4" />}
          title="Upload File"
        />

        {isMobile && (
          <ToolbarButton
            active={false}
            onClick={() => triggerCameraInput()}
            disabled={isFileUploadDisabled}
            icon={<Camera className="w-4 h-4" />}
            title="Camera"
          />
        )}

        {mode === MODES.TEXT && text?.trim().length > 0 && (
          <ToolbarButton
            active={showMathKeyboard}
            onClick={() => toggleMathKeyboard()}
            disabled={isTextInputDisabled}
            icon={<Calculator className="w-4 h-4" />}
            title="Math Keyboard"
          />
        )}
      </div>

      <div className="flex items-center gap-1">
        {(mode === MODES.TEXT && text?.length > 0) ||
          (mode === MODES.DRAW && drawingData) ||
          files.length > 0 ? (
          <ToolbarButton
            active={false}
            onClick={() => handleClear()}
            disabled={disabled || isProcessing}
            icon={<Trash2 className="w-4 h-4" />}
            title="Clear"
          />
        ) : null}

        <ToolbarButton
          active={false}
          onClick={() => handleSubmit()}
          disabled={
            disabled ||
            (!text.trim() && !drawingData && files.length === 0) ||
            isProcessing
          }
          icon={<SendHorizontal className="w-4 h-4" />}
          title='Send'
          className={`transition-colors duration-200 px-2 py-1 text-sm font-medium rounded ${isProcessing
            ? 'bg-gray-200 text-gray-500'
            : text?.trim().length > 0 || drawingData || files.length > 0
              ? 'bg-primary text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400'
            }`}
        />
      </div>
    </div>
  );
};

export default Toolbar;
