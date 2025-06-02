import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Separator } from '@/components/ui/separator';
import {
    Pen,
    Eraser,
    Trash2,
    Maximize2,
    Minimize2,
    Undo2,
    Redo2,
    Download,
    Hand
} from 'lucide-react';
import { Button } from '@/components/ui/button';
const DRAWING_STORAGE_KEY = 'mathTutorCurrentDrawing';

const StylusDrawComponent = forwardRef(({
    onContentChange,
    height = "200px",
    className = "",
    showToolbar = true,
    placeholder = "Start drawing..."
}, ref) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const eraserCursorRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentTool, setCurrentTool] = useState('pen');
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentWidth, setCurrentWidth] = useState(3);
    const [hasContent, setHasContent] = useState(false);
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);

    const colors = [
        '#000000', '#6B7280', '#EF4444', '#84CC16',
        '#06B6D4', '#0EA5E9', '#6366F1', '#D946EF',
        '#F43F5E', '#FCD34D'
    ];

    const widths = [
        { size: 1, label: 'XS' }, { size: 3, label: 'S' },
        { size: 6, label: 'M' }, { size: 10, label: 'L' },
        { size: 16, label: 'XL' }
    ];

    useEffect(() => {
        try {
            const savedState = localStorage.getItem(DRAWING_STORAGE_KEY);
            if (savedState) {
                const { paths: savedPaths, canvasOffset: savedOffset, scale: savedScale } = JSON.parse(savedState);
                if (savedPaths) setPaths(savedPaths);
                if (savedOffset) setCanvasOffset(savedOffset);
                if (savedScale) setScale(savedScale);
                setHasContent(savedPaths && savedPaths.length > 0);
            }
        } catch (error) {
            console.error("Failed to load drawing from localStorage:", error);
        }
    }, []);

    useEffect(() => {
        try {
            if (paths.length > 0 || canvasOffset.x !== 0 || canvasOffset.y !== 0 || scale !== 1) {
                const stateToSave = { paths, canvasOffset, scale };
                localStorage.setItem(DRAWING_STORAGE_KEY, JSON.stringify(stateToSave));
            } else {
                // If paths are empty and transform is default, clear storage
                localStorage.removeItem(DRAWING_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Failed to save drawing to localStorage:", error);
        }
    }, [paths, canvasOffset, scale]);


    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.restore();

        ctx.save();
        ctx.translate(canvasOffset.x, canvasOffset.y);
        ctx.scale(scale, scale);

        paths.forEach(path => {
            if (path.points.length < 1) return;

            ctx.beginPath();
            ctx.lineWidth = path.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (path.tool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.strokeStyle = path.color;
                ctx.fillStyle = path.color;
            } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = path.color;
                ctx.fillStyle = path.color;
            }

            if (path.points.length === 1) {
                ctx.arc(path.points[0].x, path.points[0].y, path.width / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.moveTo(path.points[0].x, path.points[0].y);
                if (path.points.length === 2) {
                    ctx.lineTo(path.points[1].x, path.points[1].y);
                } else {
                    for (let i = 1; i < path.points.length - 2; i++) {
                        const xc = (path.points[i].x + path.points[i + 1].x) / 2;
                        const yc = (path.points[i].y + path.points[i + 1].y) / 2;
                        ctx.quadraticCurveTo(path.points[i].x, path.points[i].y, xc, yc);
                    }
                    ctx.quadraticCurveTo(
                        path.points[path.points.length - 2].x,
                        path.points[path.points.length - 2].y,
                        path.points[path.points.length - 1].x,
                        path.points[path.points.length - 1].y
                    );
                }
                ctx.stroke();
            }
        });
        ctx.restore();
    }, [paths, canvasOffset, scale]);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const setupCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            redrawCanvas();
        };

        setupCanvas();

        const resizeObserver = new ResizeObserver(setupCanvas);
        resizeObserver.observe(container);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                toggleFullscreen();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            resizeObserver.disconnect();
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen, redrawCanvas, toggleFullscreen]);


    useEffect(() => {
        redrawCanvas();
    }, [paths, canvasOffset, scale, redrawCanvas]);

    useEffect(() => {
        onContentChange?.(hasContent);
    }, [hasContent, onContentChange]);

    useEffect(() => {
        const currentContainer = containerRef.current;
        const currentEraserCursor = eraserCursorRef.current;

        if (!currentContainer || !currentEraserCursor) return;

        const updateMousePosition = (e) => {
            if (currentTool === 'eraser') {
                currentEraserCursor.style.left = `${e.clientX}px`;
                currentEraserCursor.style.top = `${e.clientY}px`;
            }
        };

        const showEraserCursor = () => {
            if (currentTool === 'eraser') currentEraserCursor.style.display = 'block';
        };
        const hideEraserCursor = () => {
            currentEraserCursor.style.display = 'none';
        };

        if (currentTool === 'eraser') {
            currentContainer.addEventListener('mousemove', updateMousePosition);
            currentContainer.addEventListener('mouseenter', showEraserCursor);
            currentContainer.addEventListener('mouseleave', hideEraserCursor);
            showEraserCursor();
        } else {
            hideEraserCursor();
        }

        return () => {
            currentContainer.removeEventListener('mousemove', updateMousePosition);
            currentContainer.removeEventListener('mouseenter', showEraserCursor);
            currentContainer.removeEventListener('mouseleave', hideEraserCursor);
        };
    }, [currentTool]);

    useEffect(() => {
        const originalBodyOverflow = document.body.style.overflow;
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = originalBodyOverflow;
        }
        return () => {
            document.body.style.overflow = originalBodyOverflow;
        };
    }, [isFullscreen]);

    const getEventPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        return {
            x: (clientX - rect.left - canvasOffset.x) / scale,
            y: (clientY - rect.top - canvasOffset.y) / scale
        };
    };

    const saveStateForUndo = useCallback(() => {
        setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(paths))]);
        setRedoStack([]);
    }, [paths]);

    const startDrawing = (e) => {
        const pos = getEventPos(e);
        if (currentTool === 'pan') {
            setIsPanning(true);
            setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
            return;
        }

        saveStateForUndo();
        setIsDrawing(true);

        const newPoint = { x: pos.x, y: pos.y };
        const newPathData = {
            points: [newPoint],
            color: currentTool === 'eraser' ? '#000000' : currentColor,
            width: currentWidth,
            tool: currentTool,
            id: Date.now()
        };
        setPaths(prev => [...prev, newPathData]);
        setCurrentPath([newPoint]);

        if (!hasContent) setHasContent(true);
    };


    const draw = (e) => {
        if (currentTool === 'pan') {
            if (!isPanning) return;
            const newOffsetX = e.clientX - panStart.x;
            const newOffsetY = e.clientY - panStart.y;
            setCanvasOffset({ x: newOffsetX, y: newOffsetY });
            return;
        }

        if (!isDrawing) return;
        const pos = getEventPos(e);

        setPaths(prevPaths => {
            const updatedPaths = [...prevPaths];
            if (updatedPaths.length > 0) {
                const lastPath = updatedPaths[updatedPaths.length - 1];
                lastPath.points = [...lastPath.points, pos];
            }
            return updatedPaths;
        });
        setCurrentPath(prev => [...prev, pos]);
    };


    const stopDrawing = () => {
        if (currentTool === 'pan') {
            setIsPanning(false);
            return;
        }
        if (!isDrawing) return;

        setIsDrawing(false);
        setCurrentPath([]);
    };


    const handlePointerDown = (e) => {
        if (e.button !== 0 && !(e.pointerType === 'touch')) return;
        startDrawing(e);
    };

    const handlePointerMove = (e) => {
        draw(e);
    };

    const handlePointerUp = () => {
        stopDrawing();
    };

    const handlePointerLeave = () => {
        if (isDrawing) stopDrawing();
        if (isPanning) setIsPanning(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (e.ctrlKey || e.metaKey) {
            const zoomIntensity = 0.05;
            const delta = e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
            const newScale = Math.min(Math.max(0.1, scale * (1 + delta)), 10);

            const worldMouseX = (mouseX - canvasOffset.x) / scale;
            const worldMouseY = (mouseY - canvasOffset.y) / scale;

            const newOffsetX = mouseX - worldMouseX * newScale;
            const newOffsetY = mouseY - worldMouseY * newScale;

            setScale(newScale);
            setCanvasOffset({ x: newOffsetX, y: newOffsetY });
        } else {
            setCanvasOffset(prev => ({
                x: prev.x - e.deltaX,
                y: prev.y - e.deltaY
            }));
        }
    };

    const clearCanvas = useCallback(() => {
        if (paths.length > 0) {
            saveStateForUndo();
        }
        setPaths([]);
        setCurrentPath([]);
        setHasContent(false);
        setCanvasOffset({ x: 0, y: 0 });
        setScale(1);
        try {
            localStorage.removeItem(DRAWING_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear drawing from localStorage:", error);
        }
    }, [paths, saveStateForUndo]);

    const undo = useCallback(() => {
        if (undoStack.length === 0) return;
        const lastUndoState = undoStack[undoStack.length - 1];
        setRedoStack(prev => [JSON.parse(JSON.stringify(paths)), ...prev]);
        setUndoStack(prev => prev.slice(0, -1));
        setPaths(lastUndoState);
        setHasContent(lastUndoState.length > 0);
    }, [undoStack, paths]);

    const redo = useCallback(() => {
        if (redoStack.length === 0) return;
        const firstRedoState = redoStack[0];
        setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(paths))]);
        setRedoStack(prev => prev.slice(1));
        setPaths(firstRedoState);
        setHasContent(firstRedoState.length > 0);
    }, [redoStack, paths]);

    const exportDrawing = useCallback(() => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas || paths.length === 0) return null;

        const exportCanvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        let contentExists = false;

        paths.forEach(path => {
            if (path.tool === 'eraser' || path.points.length === 0) return;
            contentExists = true;
            path.points.forEach(p => {
                const halfWidth = path.width / 2;
                minX = Math.min(minX, p.x - halfWidth);
                minY = Math.min(minY, p.y - halfWidth);
                maxX = Math.max(maxX, p.x + halfWidth);
                maxY = Math.max(maxY, p.y + halfWidth);
            });
        });

        const padding = 20;

        if (contentExists && isFinite(minX)) {
            const contentWidth = maxX - minX + 2 * padding;
            const contentHeight = maxY - minY + 2 * padding;
            exportCanvas.width = contentWidth * dpr;
            exportCanvas.height = contentHeight * dpr;
        } else {
            exportCanvas.width = currentCanvas.width;
            exportCanvas.height = currentCanvas.height;
            minX = -canvasOffset.x / scale;
            minY = -canvasOffset.y / scale;
        }


        const exportCtx = exportCanvas.getContext('2d');
        exportCtx.scale(dpr, dpr);
        exportCtx.fillStyle = '#FFFFFF';
        exportCtx.fillRect(0, 0, exportCanvas.width / dpr, exportCanvas.height / dpr);


        exportCtx.save();
        if (contentExists && isFinite(minX)) {
            exportCtx.translate(-minX + padding, -minY + padding);
        } else {
            exportCtx.translate(canvasOffset.x / scale, canvasOffset.y / scale);
        }

        paths.forEach(path => {
            if (path.points.length < 1 || path.tool === 'eraser') return;

            exportCtx.beginPath();
            exportCtx.lineWidth = path.width;
            exportCtx.lineCap = 'round';
            exportCtx.lineJoin = 'round';
            exportCtx.strokeStyle = path.color;
            exportCtx.fillStyle = path.color;
            exportCtx.globalCompositeOperation = 'source-over';

            if (path.points.length === 1) {
                exportCtx.arc(path.points[0].x, path.points[0].y, path.width / 2, 0, Math.PI * 2);
                exportCtx.fill();
            } else {
                exportCtx.moveTo(path.points[0].x, path.points[0].y);
                if (path.points.length === 2) {
                    exportCtx.lineTo(path.points[1].x, path.points[1].y);
                } else {
                    for (let i = 1; i < path.points.length - 2; i++) {
                        const xc = (path.points[i].x + path.points[i + 1].x) / 2;
                        const yc = (path.points[i].y + path.points[i + 1].y) / 2;
                        exportCtx.quadraticCurveTo(path.points[i].x, path.points[i].y, xc, yc);
                    }
                    exportCtx.quadraticCurveTo(
                        path.points[path.points.length - 2].x,
                        path.points[path.points.length - 2].y,
                        path.points[path.points.length - 1].x,
                        path.points[path.points.length - 1].y
                    );
                }
                exportCtx.stroke();
            }
        });
        exportCtx.restore();

        return exportCanvas.toDataURL('image/png');
    }, [paths, scale, canvasOffset]);


    const downloadDrawing = useCallback(() => {
        if (paths.length === 0) return;
        const dataURL = exportDrawing();
        if (!dataURL) return;
        const link = document.createElement('a');
        link.download = `drawing-${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [paths, exportDrawing]);

    const resetDocument = useCallback(() => {
        clearCanvas();
        setUndoStack([]);
        setRedoStack([]);
    }, [clearCanvas]);

    useImperativeHandle(ref, () => ({
        exportDrawing,
        resetDocument,
        hasContent,
        undo,
        redo,
        clearCanvas
    }), [exportDrawing, resetDocument, hasContent, undo, redo, clearCanvas]);

    const containerClasses = `
    ${isFullscreen
            ? 'fixed inset-0 z-50 bg-gray-100 dark:bg-gray-900'
            : `relative bg-gray-100 dark:bg-gray-800 ${className}`
        }
    flex flex-col items-center justify-center
`;

    const containerStyle = {
        height: isFullscreen ? '100vh' : height,
        width: isFullscreen ? '100vw' : '100%',
        overflow: 'hidden'
    };

    const getCursorStyle = () => {
        if (currentTool === 'eraser') return 'cursor-none';
        if (currentTool === 'pan') return isPanning ? 'cursor-grabbing' : 'cursor-grab';
        return 'cursor-crosshair';
    };

    const colorToolbarStyle = {
        top: '1rem',
        right: '1rem',
        maxHeight: isFullscreen
            ? 'calc(100vh - 2rem)'
            : `calc(${(typeof height === 'number' ? `${height}px` : height) || '200px'} - 2rem)`,
    };


    return (
        <div
            ref={containerRef}
            className={containerClasses}
            style={containerStyle}
            tabIndex={-1}
        >
            <canvas
                ref={canvasRef}
                className={`touch-none block ${getCursorStyle()}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onWheel={handleWheel}
                style={{ touchAction: 'none', userSelect: 'none', outline: 'none' }}
            />

            {!hasContent && paths.length === 0 && placeholder && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-lg font-medium px-4 py-2 text-black">
                        {placeholder}
                    </p>
                </div>
            )}

            {showToolbar && (
                <>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-1 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600">
                        <Button variant={currentTool === 'pen' ? 'secondary' : 'ghost'} size="icon" onClick={() => setCurrentTool('pen')} title="Pen"> <Pen className="w-5 h-5" /> </Button>
                        <Button variant={currentTool === 'eraser' ? 'secondary' : 'ghost'} size="icon" onClick={() => setCurrentTool('eraser')} title="Eraser"> <Eraser className="w-5 h-5" /> </Button>
                        <Button variant={currentTool === 'pan' ? 'secondary' : 'ghost'} size="icon" onClick={() => setCurrentTool('pan')} title="Pan/Move"> <Hand className="w-5 h-5" /> </Button>
                        <Separator orientation="vertical" className="h-6 mx-1 bg-gray-300 dark:bg-gray-500" />
                        <Button variant="ghost" size="icon" onClick={undo} disabled={undoStack.length === 0} title="Undo"> <Undo2 className="w-5 h-5" /> </Button>
                        <Button variant="ghost" size="icon" onClick={redo} disabled={redoStack.length === 0} title="Redo"> <Redo2 className="w-5 h-5" /> </Button>
                        <Separator orientation="vertical" className="h-6 mx-1 bg-gray-300 dark:bg-gray-500" />
                        <Button variant="ghost" size="icon" onClick={clearCanvas} disabled={paths.length === 0 && canvasOffset.x === 0 && canvasOffset.y === 0 && scale === 1} title="Clear All"> <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" /> </Button>
                        <Button variant="ghost" size="icon" onClick={downloadDrawing} disabled={paths.length === 0} title="Download"> <Download className="w-5 h-5" /> </Button>
                        <Button variant="ghost" size="icon" onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}> {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />} </Button>
                    </div>

                    <div
                        className="absolute z-20 flex flex-col gap-4 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 w-36 overflow-y-auto scrollbar-none"
                        style={colorToolbarStyle}
                    >
                        <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Color</span>
                            <div className="grid grid-cols-3 gap-1.5">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform focus:outline-none
                                        ${currentColor === color && currentTool !== 'eraser'
                                                ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-600 ring-offset-1'
                                                : 'border-gray-300 dark:border-gray-500 hover:border-gray-400 dark:hover:border-gray-400'
                                            }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => { setCurrentColor(color); if (currentTool === 'eraser') setCurrentTool('pen'); }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                        <Separator className="bg-gray-200 dark:bg-gray-600" />
                        <div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Brush Size</span>
                            <div className="grid grid-cols-2 gap-2">
                                {widths.map(({ size, label }) => (
                                    <Button
                                        key={size}
                                        variant={currentWidth === size ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="w-full justify-start text-sm h-8"
                                        onClick={() => setCurrentWidth(size)}
                                        title={`Brush Size: ${label} (${size}px)`}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {isFullscreen && (
                <div className="absolute top-4 left-4 text-black px-3 py-1.5 rounded-full text-xs font-medium z-30 select-none">
                    Press ESC to exit
                </div>
            )}

            <div
                ref={eraserCursorRef}
                className="pointer-events-none fixed rounded-full border-2 border-red-500 bg-red-500/30 z-[9999]"
                style={{
                    display: 'none',
                    width: `${Math.max(currentWidth * scale, 2)}px`,
                    height: `${Math.max(currentWidth * scale, 2)}px`,
                    transform: `translate(-50%, -50%)`,
                }}
            />
        </div>
    )
});

StylusDrawComponent.displayName = 'StylusDrawComponent';

export default StylusDrawComponent;