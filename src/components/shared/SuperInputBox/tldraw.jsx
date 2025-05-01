'use client';

import { useEffect, useState, useCallback } from 'react';
import { Tldraw, track, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import './custom-ui.css';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function TLDrawWhiteboard({
  onContentChange,
  disabled = false,
  height = '500px',
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div
      className={`relative w-full bg-white transition-all duration-300 ease-in-out ${
        isExpanded ? 'fixed inset-0 bg-white' : 'h-full'
      }`}
      style={{ height: isExpanded ? '100vh' : height }}
    >
      <Tldraw hideUi>
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

    useEffect(() => {
      const update = () => {
        const shapes = editor.getCurrentPageShapes();
        const newHasContent = shapes.length > 0;
        setHasContent(newHasContent);

        if (newHasContent !== hasContent) {
          if (!newHasContent) {
            onContentChange(null);
          } else {
            // Export the drawing when content changes
            exportPNG();
          }
        }
      };

      editor.store.listen(update);
      return () => editor.store?.removeListener?.('change', update);
    }, [editor, setHasContent, hasContent, onContentChange]);

    useEffect(() => {
      const el = document.querySelector('.tl-watermark_SEE-LICENSE');
      if (el) el.style.display = 'none';
    }, []);

    const exportPNG = async () => {
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
    };

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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M17 7H8M17 7V16"></path>
            </svg>
          </button>
          <button
            className="custom-button"
            data-isactive={editor.getCurrentToolId() === 'draw'}
            onClick={() => editor.setCurrentTool('draw')}
            disabled={disabled}
            title="Draw"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
            </svg>
          </button>
          <button
            className="custom-button"
            data-isactive={editor.getCurrentToolId() === 'eraser'}
            onClick={() => editor.setCurrentTool('eraser')}
            disabled={disabled}
            title="Eraser"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
              <path d="M22 21H7"></path>
              <path d="m5 11 9 9"></path>
            </svg>
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
