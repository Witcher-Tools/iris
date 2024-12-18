import React, { useState, useRef, useEffect } from "react";
import "./Map.css";

const TILE_SIZE = 256; // Unscaled tile size
const GRID_SIZE = 16; // Grid size (16x16 tiles)
const ZOOM_FACTOR = 1.25;
const TILE_PADDING = 2; // Overlap to sprevent gaps

const MapCanvas = ({children}) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1); // Zoom level
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Panning offset
    const [minZoom, setMinZoom] = useState(1); // Minimum zoom
    const dragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const totalWidth = TILE_SIZE * GRID_SIZE;
    const totalHeight = TILE_SIZE * GRID_SIZE;

    const calculateMinZoom = () => {
        const container = containerRef.current;
        const minScaleX = container.offsetWidth / totalWidth;
        const minScaleY = container.offsetHeight / totalHeight;
        const calculatedMinZoom = Math.max(minScaleX, minScaleY);

        setMinZoom(calculatedMinZoom);
        setScale(calculatedMinZoom);
        setOffset({ x: 0, y: 0 });
    };

    useEffect(() => {
        calculateMinZoom();
        window.addEventListener("resize", calculateMinZoom);
        return () => window.removeEventListener("resize", calculateMinZoom);
    }, []);

    const clampOffset = (newX, newY, scale) => {
        const container = containerRef.current;
        const visibleWidth = container.offsetWidth / scale;
        const visibleHeight = container.offsetHeight / scale;

        const maxX = totalWidth - visibleWidth;
        const maxY = totalHeight - visibleHeight;

        return {
            x: Math.min(0, Math.max(newX, -maxX)),
            y: Math.min(0, Math.max(newY, -maxY)),
        };
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();

        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        const zoomFactor = e.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
        const newScale = Math.max(minZoom, Math.min(5, scale * zoomFactor));

        const newOffsetX = cursorX - (cursorX - offset.x) * (newScale / scale);
        const newOffsetY = cursorY - (cursorY - offset.y) * (newScale / scale);

        const clampedOffset = clampOffset(newOffsetX, newOffsetY, newScale);

        setScale(newScale);
        setOffset(clampedOffset);
    };

    const handleMouseDown = (e) => {
        dragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!dragging.current) return;

        const deltaX = (e.clientX - dragStart.current.x) / scale;
        const deltaY = (e.clientY - dragStart.current.y) / scale;

        const newOffset = clampOffset(offset.x + deltaX, offset.y + deltaY, scale);
        setOffset(newOffset);

        dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        dragging.current = false;
    };

    return (
        <div className="gwent-map">
            {children}
            <div
                className="map-container"
                ref={containerRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className="scaled-wrapper"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                    }}
                >
                    <div
                        className="map-content"
                        style={{
                            transform: `translate(${Math.round(offset.x)}px, ${Math.round(offset.y)}px)`,
                        }}
                    >
                        {Array.from({ length: GRID_SIZE }, (_, rowIndex) =>
                            Array.from({ length: GRID_SIZE }, (_, colIndex) => (
                                <img
                                    className="tile"
                                    key={`${rowIndex}-${colIndex}`}
                                    src={`images/tiles/tile_x0${colIndex
                                        .toString()
                                        .padStart(2, "0")}_y0${rowIndex
                                        .toString()
                                        .padStart(2, "0")}.png`}
                                    alt={`Tile ${rowIndex}-${colIndex}`}
                                    style={{
                                        position: "absolute",
                                        left: colIndex * TILE_SIZE - TILE_PADDING / 2,
                                        top: rowIndex * TILE_SIZE - TILE_PADDING / 2,
                                        width: TILE_SIZE + TILE_PADDING,
                                        height: TILE_SIZE + TILE_PADDING,
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapCanvas;
