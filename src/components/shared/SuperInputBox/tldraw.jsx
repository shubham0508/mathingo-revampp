'use client';

import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
// The import 'tldraw' and 'track' might behave differently depending on the actual package.
// If 'track' is from @tldraw/tldraw (v2) but the editor is v1, CustomToolbar reactivity might be affected.
import { Tldraw, track } from 'tldraw';
import 'tldraw/tldraw.css';
import './custom-ui.css'; // Ensure this file exists and is correctly styled
import {
  Maximize2,
  Minimize2,
  Pencil,
  MousePointerClick,
  Eraser,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Helper function for Tldraw v1 style SVG export
async function getSvgDataUrl_v1(editor, shapes, options = {}) {
  if (!editor || typeof editor.getSvg !== 'function') {
    console.error("Editor instance does not have getSvg method (v1 API expected).");
    return null;
  }
  if (!shapes || shapes.length === 0) {
    return null;
  }

  const svgElement = editor.getSvg(shapes, {
    padding: options.padding === undefined ? 16 : options.padding,
    background: options.background === undefined ? false : options.background,
    darkMode: options.darkMode === undefined ? false : options.darkMode,
    // Note: `scale` is not a direct option for v1's `getSvg`.
    // The resulting SVG is vector. Scale is typically handled during rasterization if needed.
  });

  if (!svgElement) {
    return null;
  }

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  
  // To handle potential Unicode characters in SVG content correctly with btoa:
  const base64EncodedSvg = btoa(unescape(encodeURIComponent(svgString)));
  
  return `data:image/svg+xml;base64,${base64EncodedSvg}`;
}


const TLDrawWhiteboard = forwardRef(function TLDrawWhiteboard({
  onContentChange,
  disabled = false,
  height = '200px',
}, ref) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const [internalHasContent, setInternalHasContent] = useState(false);

  useImperativeHandle(ref, () => ({
    resetDocument: () => {
      if (editorInstance) {
        if (typeof editorInstance.deleteAllShapes === 'function') { // v1 API
          editorInstance.deleteAllShapes();
        } else if (typeof editorInstance.deleteShapes === 'function' && editorInstance.currentPageShapes) { // Older v1 variant
            const allShapeIds = editorInstance.currentPageShapes.map(s => s.id);
            if (allShapeIds.length > 0) editorInstance.deleteShapes(allShapeIds);
        }
        // The change listener in CustomToolbar should handle updating content state.
      }
    },
    exportDrawing: async () => {
      if (!editorInstance) return null;
      try {
        // v1: editor.currentPageShapes
        const shapes = editorInstance.currentPageShapes || 
                       (typeof editorInstance.getCurrentPageShapes === 'function' ? editorInstance.getCurrentPageShapes() : []);
        
        if (shapes.length === 0) return null;

        return await getSvgDataUrl_v1(
          editorInstance,
          shapes,
          {
            // scale: 2, // `scale` is not directly used by getSvgDataUrl_v1 helper
            background: false,
            padding: 16,
            darkMode: false,
          }
        );
      } catch (error) {
        console.error('Error exporting drawing (from useImperativeHandle for v1):', error);
        toast.error('Failed to prepare drawing for submission.');
        return null;
      }
    },
    getEditor: () => editorInstance,
  }), [editorInstance]);

  const toggleExpand = useCallback(() => {
    if (disabled) return;
    setIsExpanded((prev) => !prev);
  }, [disabled]);

  const handleMount = useCallback((editor) => {
    setEditorInstance(editor);
    if (!disabled) {
      if (typeof editor.selectTool === 'function') { // v1 API
        editor.selectTool('draw');
      } else if (typeof editor.setCurrentTool === 'function') { // v2-like API (fallback)
        if (editor.tools?.draw) editor.setCurrentTool('draw');
        else editor.setCurrentTool('select');
      }
    }
    
    // For Tldraw v1, watermark is usually '.tl-watermark'
    const v1Watermark = document.querySelector('.tl-watermark');
    if (v1Watermark) (v1Watermark).style.display = 'none';
    // If it's a hybrid version, you might also need to check v2 selectors like '.tlui-watermark'
    const v2Watermark = document.querySelector('.tlui-watermark');
    if (v2Watermark) (v2Watermark).style.display = 'none';

  }, [disabled]);

  const handleInternalContentChange = useCallback((newHasContent, dataUrl, editor, error) => {
    setInternalHasContent(newHasContent);
    if (onContentChange) {
      onContentChange(newHasContent, dataUrl, editor, error);
    }
  }, [onContentChange]);

  return (
    <div
      className={`relative w-full bg-white transition-all duration-300 ease-in-out ${isExpanded ? 'fixed inset-0 z-50' : ''}`}
      style={{ height: isExpanded ? '100vh' : height }}
    >
      <Tldraw
        // persistenceKey and components props are more common in v2. Their effect depends on your Tldraw package.
        persistenceKey="tldraw_aimath_stylus" 
        onMount={handleMount}
        autoFocus
        components={{ // This is a v2 prop; might be ignored if using v1 core
          Toolbar: null, QuickActions: null, HelperButtons: null, SharePanel: null, MenuPanel: null,
          TopPanel: null, Minimap: null, StylePanel: null, PageMenu: null, ZoomMenu: null, MainMenu: null,
          ActionsMenu: null, DebugPanel: null, DebugMenu: null, 
        }}
      >
        {editorInstance && (
          <CustomToolbar
            editor={editorInstance}
            onContentChange={handleInternalContentChange}
            disabled={disabled}
            hasContentState={[internalHasContent, setInternalHasContent]}
            isExpanded={isExpanded}
            toggleExpand={toggleExpand}
          />
        )}
      </Tldraw>
    </div>
  );
});

const CustomToolbar = track( // `track` is from @tldraw/tldraw (v2). If your `tldraw` package is pure v1, this might not work as expected for reactivity.
  ({
    editor,
    onContentChange,
    disabled,
    hasContentState,
    isExpanded,
    toggleExpand,
  }) => {
    const [hasContent, setHasContent] = hasContentState;

    useEffect(() => {
      if (editor) {
        if (disabled) {
          if (typeof editor.selectTool === 'function') editor.selectTool('select'); // v1
          if (editor.hasOwnProperty('readOnly')) editor.readOnly = true; // v1: editor.readOnly property
        } else {
          if (editor.hasOwnProperty('readOnly')) editor.readOnly = false; // v1
          if (typeof editor.selectTool === 'function') editor.selectTool('draw'); // v1
        }
      }
    }, [editor, disabled]);

    const exportContent = useCallback(async () => {
      if (!editor || (editor.hasOwnProperty('readOnly') && editor.readOnly && editor.readOnly === true) || disabled) {
        return;
      }

      try {
        // v1: editor.currentPageShapes
        const shapesToExport = editor.currentPageShapes || 
                               (typeof editor.getCurrentPageShapes === 'function' ? editor.getCurrentPageShapes() : []);

        if (shapesToExport.length === 0) {
          if (hasContent) {
            setHasContent(false);
            onContentChange(false, null, editor, null);
          }
          return;
        }
        
        const dataUrl = await getSvgDataUrl_v1(editor, shapesToExport, {
          // scale: 2, // Not directly used by getSvgDataUrl_v1 helper
          background: false,
          padding: 16,
          darkMode: false,
        });

        if (dataUrl) {
          if (!hasContent) setHasContent(true);
          onContentChange(true, dataUrl, editor, null);
        } else {
          // dataUrl is null, means no exportable content from getSvgDataUrl_v1
          if (hasContent) {
            setHasContent(false);
            onContentChange(false, null, editor, null);
          }
        }
      } catch (error) {
        console.error('Unexpected error during drawing export (v1 path):', error);
        // Only show toast for truly unexpected errors, not for null dataUrl which means "empty"
        if (error && error.message !== "Editor instance does not have getSvg method (v1 API expected).") {
           toast.error('An error occurred while processing the drawing.');
        }
        onContentChange(hasContent, null, editor, error); 
      }
    }, [editor, onContentChange, disabled, hasContent, setHasContent]);

    useEffect(() => {
      if (!editor) return;

      const handleChangeEvent = () => {
        // v1: editor.currentPageShapes
        const currentShapes = editor.currentPageShapes || 
                              (typeof editor.getCurrentPageShapes === 'function' ? editor.getCurrentPageShapes() : []);
        const newHasContentOnPage = currentShapes.length > 0;

        if (newHasContentOnPage) {
          exportContent();
        } else { 
          if (hasContent) { 
            setHasContent(false);
            onContentChange(false, null, editor, null);
          }
        }
      };

      let unsubscribe;
      // Attempt to use v2-like store listener first, then fallback to v1 event system
      if (typeof editor.store?.listen === 'function') {
         unsubscribe = editor.store.listen(handleChangeEvent, {
          scope: 'document', // This scope might be v2 specific
          // source: 'user', // 'source' might not be available or reliable in all v1 event systems
        });
      } else if (typeof editor.on === 'function') {
        // 'persist' is a common v1 event that fires after a change is committed (e.g., to undo stack)
        // 'change-history' is another possibility. 'change' might be too frequent.
        editor.on('persist', handleChangeEvent); 
        unsubscribe = () => editor.off('persist', handleChangeEvent);
      } else {
        console.warn("Tldraw editor does not support 'store.listen' or 'on'. Content changes might not be detected automatically.");
        return;
      }
      
      // Initial check for persisted content
      const initialCheckTimeout = setTimeout(() => {
        if (editor) {
            const initialShapes = editor.currentPageShapes || 
                                  (typeof editor.getCurrentPageShapes === 'function' ? editor.getCurrentPageShapes() : []);
            if (initialShapes.length > 0) {
                if (!hasContent) setHasContent(true); // Set if not already true
                exportContent();
            }
        }
      }, 100);

      return () => {
        if (unsubscribe) unsubscribe();
        clearTimeout(initialCheckTimeout);
      };
    }, [editor, exportContent, hasContent, setHasContent, onContentChange]);

    const handleClear = useCallback(() => {
      if (disabled || !editor) return;
      if (typeof editor.deleteAllShapes === 'function') { // v1 API
        editor.deleteAllShapes();
      } else if (typeof editor.deleteShapes === 'function' && editor.currentPageShapes) { // Older v1 variant
         const allShapeIds = editor.currentPageShapes.map(s => s.id);
         if (allShapeIds.length > 0) editor.deleteShapes(allShapeIds);
      }
      // The change listener (handleChangeEvent) should pick this up.
    }, [editor, disabled]);
    
    // For v1, current tool is often editor.currentTool.id
    const currentToolId = editor?.currentTool?.id || editor?.currentToolId; // Attempt both
    const selectTool = (toolName) => {
        if (editor) {
            if (typeof editor.selectTool === 'function') editor.selectTool(toolName);
            else if (typeof editor.setCurrentTool === 'function') editor.setCurrentTool(toolName);
        }
    };

    return (
      <div className="custom-layout" style={{ zIndex: isExpanded ? 51 : 'auto' }}>
        <div className="custom-toolbar">
          <button
            className="custom-button"
            data-isactive={currentToolId === 'select'}
            onClick={() => selectTool('select')}
            disabled={disabled || !editor}
            title="Select"
          >
            <MousePointerClick className="w-5 h-5" />
          </button>
          <button
            className="custom-button"
            data-isactive={currentToolId === 'draw'}
            onClick={() => selectTool('draw')}
            disabled={disabled || !editor}
            title="Draw"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            className="custom-button"
            // v1 tool name is 'erase', v2 'eraser'. Check currentToolId if it's set.
            data-isactive={currentToolId === 'erase' || currentToolId === 'eraser'}
            onClick={() => selectTool(editor?.tools?.eraser ? 'eraser' : 'erase')} // Prefer 'eraser' if tool exists, else 'erase'
            disabled={disabled || !editor}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
          <button
            className="custom-button action-button"
            onClick={handleClear}
            disabled={disabled || !hasContent || !editor}
            title="Clear Drawing"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="custom-button action-button"
            onClick={toggleExpand}
            disabled={disabled || !editor}
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

export default TLDrawWhiteboard;