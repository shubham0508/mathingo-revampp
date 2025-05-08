'use client';

import { useEffect, useState, useCallback } from 'react';
import { Tldraw, track, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import './custom-ui.css';
import {
  Maximize2,
  Minimize2,
  Pencil,
  MousePointerClick,
  Eraser,
} from 'lucide-react';

export default function TLDrawWhiteboard({
  onContentChange,
  disabled = false,
  height = '200px',
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div
      className={`relative w-full bg-white transition-all duration-300 ease-in-out ${
        isExpanded ? 'fixed inset-0' : ''
      }`}
      style={{ height: isExpanded ? '100vh' : height }}
    >
      <Tldraw
        components={{
          Toolbar: null,
          KeyboardShortcutsDialog: null,
          QuickActions: null,
          HelperButtons: null,
          DebugPanel: null,
          DebugMenu: null,
          SharePanel: null,
          MenuPanel: null,
          TopPanel: null,
          CursorChatBubble: null,
          RichTextToolbar: null,
          Dialogs: null,
          Toasts: null,
          A11y: null,
        }}
      >
        <CustomToolbar
          onContentChange={onContentChange}
          disabled={disabled}
          hasContent={hasContent}
          setHasContent={setHasContent}
          isExpanded={isExpanded}
          toggleExpand={toggleExpand}
        />
      </Tldraw>
    </div>
  );
}

const CustomToolbar = track(
  ({
    onContentChange,
    hasContent,
    setHasContent,
    disabled,
    isExpanded,
    toggleExpand,
  }) => {
    const editor = useEditor();

    // 🟡 Select the pen tool by default on mount
    useEffect(() => {
      if (!disabled) {
        editor.setCurrentTool('draw');
      }
    }, [editor, disabled]);

    // 🟡 Hide watermark
    useEffect(() => {
      const el = document.querySelector('.tl-watermark_SEE-LICENSE');
      if (el) el.style.display = 'none';
    }, []);

    // 🟡 Listen for changes and export when needed
    useEffect(() => {
      const update = () => {
        const shapes = editor.getCurrentPageShapes();
        const newHasContent = shapes.length > 0;

        if (newHasContent !== hasContent) {
          setHasContent(newHasContent);
          if (!newHasContent) {
            onContentChange(null);
          } else {
            exportPNG();
          }
        }
      };

      const unsub = editor.store.listen(update);
      return () => unsub();
    }, [editor, hasContent, setHasContent, onContentChange]);

    // 🟡 Export drawing as PNG
    const exportPNG = useCallback(async () => {
      if (disabled) return;

      try {
        const shapeIds = editor.getCurrentPageShapeIds();
        if (shapeIds.size === 0) return;

        const { blob } = await editor.toImage([...shapeIds], {
          format: 'png',
          background: false,
          padding: 16,
          scale: 2,
        });

        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            onContentChange(reader.result);
          };
          reader.readAsDataURL(blob);
        }
      } catch (error) {
        console.error('Error exporting drawing:', error);
      }
    }, [editor, onContentChange, disabled]);

    const handleClear = useCallback(() => {
      editor.deleteAll();
      setHasContent(false);
      onContentChange(null);
    }, [editor, setHasContent, onContentChange]);

    return (
      <div className="custom-layout">
        <div className="custom-toolbar">
          <button
            className="custom-button"
            data-isactive={editor.getCurrentToolId() === 'select'}
            onClick={() => editor.setCurrentTool('select')}
            disabled={disabled}
            title="Select"
          >
            <MousePointerClick className="w-5 h-5" />
          </button>

          <button
            className="custom-button"
            data-isactive={editor.getCurrentToolId() === 'draw'}
            onClick={() => editor.setCurrentTool('draw')}
            disabled={disabled}
            title="Draw"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <button
            className="custom-button"
            data-isactive={editor.getCurrentToolId() === 'eraser'}
            onClick={() => editor.setCurrentTool('eraser')}
            disabled={disabled}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>

          <button
            className="custom-button action-button"
            onClick={toggleExpand}
            disabled={disabled}
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    );
  },
);
