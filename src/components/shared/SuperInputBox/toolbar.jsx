import React from 'react';
import {
  Type,
  Upload,
  Camera,
  Pencil,
  Calculator,
  Trash2,
  SendHorizontal,
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
}) => (
  <div className="px-3 py-2 flex justify-between items-center bg-white">
    <div className="flex items-center gap-1">
      <ToolbarButton
        active={mode === MODES.TEXT}
        onClick={() => setMode(MODES.TEXT)}
        disabled={disabled}
        icon={<Type />}
        title="Text input"
      />

      <ToolbarButton
        active={false}
        onClick={triggerFileInput}
        disabled={disabled || mode === MODES.DRAW}
        icon={<Upload />}
        title="Upload files"
      />

      {isMobile && (
        <ToolbarButton
          active={false}
          onClick={triggerCameraInput}
          disabled={disabled}
          icon={<Camera />}
          title="Take photo"
        />
      )}

      <ToolbarButton
        active={mode === MODES.DRAW}
        onClick={() => setMode(MODES.DRAW)}
        disabled={disabled}
        icon={<Pencil />}
        title="Draw"
      />
      {mode === MODES.TEXT ? (
        <ToolbarButton
          active={showMathKeyboard}
          onClick={toggleMathKeyboard}
          disabled={disabled}
          icon={<Calculator />}
          title="Math keyboard"
        />
      ) : null}
    </div>

    <div className="flex items-center gap-1">
      {(mode === MODES.TEXT && text?.length > 0) ||
      (mode === MODES.DRAW && drawingData) ||
      files.length > 0 ? (
        <ToolbarButton
          active={false}
          onClick={handleClear}
          disabled={disabled}
          icon={<Trash2 />}
          title="Clear"
        />
      ) : null}

      <ToolbarButton
        active={false}
        onClick={handleSubmit}
        disabled={
          disabled || (!text.trim() && !drawingData && files.length === 0)
        }
        icon={<SendHorizontal />}
        title="Send"
        highlight={text.trim() || drawingData || files.length > 0}
      />
    </div>
  </div>
);

export default Toolbar;
