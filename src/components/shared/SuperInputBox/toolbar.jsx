import React from 'react';
import {
  Type,
  Upload,
  Camera,
  Pencil,
  Calculator,
  Trash2,
  SendHorizontal,
  Loader2,
} from 'lucide-react';
import ToolbarButton from './toolbar-button';
import { MODES } from '@/config/constant';

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
    <div className="px-4 py-3 flex justify-between items-center bg-white rounded-b-lg">
      <div className="flex items-center gap-2">
        <ToolbarButton
          active={mode === MODES.TEXT}
          onClick={() => setMode(MODES.TEXT)}
          disabled={isTextInputDisabled}
          icon={
            <Type
              className={
                mode === MODES.TEXT ? 'text-blue-600' : 'text-gray-600'
              }
            />
          }
          title="Text input"
          className={`hover:bg-blue-50 ${mode === MODES.TEXT ? 'bg-blue-50 border-blue-200' : ''}`}
        />

        <ToolbarButton
          active={false}
          onClick={triggerFileInput}
          disabled={isFileUploadDisabled}
          icon={<Upload className="text-emerald-600" />}
          title="Upload files"
          className="hover:bg-emerald-50"
        />

        {isMobile && (
          <ToolbarButton
            active={false}
            onClick={triggerCameraInput}
            disabled={isFileUploadDisabled}
            icon={<Camera className="text-purple-600" />}
            title="Take photo"
            className="hover:bg-purple-50"
          />
        )}

        {mode === MODES.TEXT ? (
          <ToolbarButton
            active={showMathKeyboard}
            onClick={toggleMathKeyboard}
            disabled={disabled || isProcessing || isTextInputDisabled}
            icon={
              <Calculator
                className={
                  showMathKeyboard ? 'text-amber-600' : 'text-gray-600'
                }
              />
            }
            title="Math keyboard"
            className={`hover:bg-amber-50 ${showMathKeyboard ? 'bg-amber-50 border-amber-200' : ''}`}
          />
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {(mode === MODES.TEXT && text?.length > 0) ||
        (mode === MODES.DRAW && drawingData) ||
        files.length > 0 ? (
          <ToolbarButton
            active={false}
            onClick={handleClear}
            disabled={disabled || isProcessing}
            icon={<Trash2 className="text-red-500" />}
            title="Clear"
            className="hover:bg-red-50"
          />
        ) : null}

        <ToolbarButton
          active={false}
          onClick={handleSubmit}
          disabled={
            disabled ||
            (!text.trim() && !drawingData && files.length === 0) ||
            isProcessing
          }
          icon={
            isProcessing ? (
              <Loader2 className="animate-spin text-white" />
            ) : (
              <SendHorizontal className="text-white" />
            )
          }
          title={isProcessing ? 'Processing...' : 'Send'}
          highlight={text.trim() || drawingData || files.length > 0}
          className={`transition-all duration-300 ${
            isProcessing
              ? 'bg-blue-400'
              : text.trim() || drawingData || files.length > 0
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300'
          }`}
        />
      </div>
    </div>
  );
};

export default Toolbar;
