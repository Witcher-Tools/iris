import React, {useEffect, useRef, useState} from "react";

import {selectTexture, setTextures} from "@/redux/action/iris.js";
import {useDispatch, useSelector} from "react-redux";

import "./Range.css";

const TOTAL_RANGE = 255;
const MIN_ZOOM = 1;
const MAX_ZOOM = 10;

const TextureRangeSelector = () => {
    const rangeBarRef = useRef(null);
    const gridRef = useRef(null);

    const dispatch = useDispatch();

    const textures = useSelector((state) => state.textureState.textures);
    const selectedRangeIndex = useSelector((state) => state.textureState.selectedTexture);

    const [zoomLevel, setZoomLevel] = useState(1);
    const [viewportOffset, setViewportOffset] = useState(0);

    useEffect(() => {
        console.log(zoomLevel, viewportOffset);

        const rangeBar = rangeBarRef.current;

        if (!rangeBar) return;

        window.addEventListener("keydown", handleKeyDown);
        rangeBar.addEventListener("wheel", handleWheel);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            rangeBar.removeEventListener("wheel", handleWheel);
        };
    }, [selectedRangeIndex, textures, zoomLevel, viewportOffset]);

    const updateRangeValues = (index, newValue) => {
        const updatedTextures = textures.map((texture, i) => {
            if (i === index) {
                const maxRight =
                    i < textures.length - 1 ? textures[i + 1].end - 1 : TOTAL_RANGE;
                const minLeft = i > 0 ? texture.start : 1;
                return {
                    ...texture,
                    end: Math.max(Math.min(newValue, maxRight), minLeft),
                };
            }

            if (i === index + 1) {
                const minLeft = i > 0 ? textures[i - 1].start + 1 : 1;

                return {
                    ...texture,
                    start: Math.max(Math.min(newValue, texture.end), minLeft),
                };
            }

            return texture;
        });

        dispatch(setTextures(updatedTextures));
    };

    const handleMouseDown = (e, index) => {
        const rangeBar = rangeBarRef.current;
        const rangeBarHeight = rangeBar.offsetHeight;

        const onMouseMove = (moveEvent) => {
            const rect = rangeBar.getBoundingClientRect();
            const cursorY = moveEvent.clientY - rect.top;
            const newValue = Math.round(
                ((rangeBarHeight - cursorY) / rangeBarHeight) * TOTAL_RANGE
            );

            updateRangeValues(index, newValue);
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleKeyDown = (e) => {
        if (selectedRangeIndex === null) return;

        if (e.key === "ArrowDown") {
            const newIndex = Math.max(0, selectedRangeIndex - 1);
            dispatch(selectTexture(newIndex));
        } else if (e.key === "ArrowUp") {
            const newIndex = Math.min(textures.length - 1, selectedRangeIndex + 1);
            dispatch(selectTexture(newIndex));
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();

        const rangeBar = rangeBarRef.current;
        if (!rangeBar) return;

        const rect = rangeBar.getBoundingClientRect();

        const cursorY = e.clientY - rect.top;
        const containerHeight = rect.height;

        if (e.ctrlKey) {
            const cursorFromBottom = containerHeight - cursorY;
            const totalZoomedHeight = containerHeight * zoomLevel;
            const valueAtCursor = ((cursorFromBottom + viewportOffset) / totalZoomedHeight) * TOTAL_RANGE;

            const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoomLevel = Math.min(Math.max(zoomLevel * zoomDelta, MIN_ZOOM), MAX_ZOOM);

            const newTotalHeight = containerHeight * newZoomLevel;
            const newPositionFromBottom = (valueAtCursor / TOTAL_RANGE) * newTotalHeight;
            const newOffset = newPositionFromBottom - cursorFromBottom;

            setZoomLevel(newZoomLevel);
            setViewportOffset(Math.max(0, Math.min(newOffset, newTotalHeight - containerHeight)));

            return;
        }
        if (selectedRangeIndex === null) return;

        const step = e.deltaY < 0 ? 1 : -1;
        const texture = textures[selectedRangeIndex];

        const newValue = texture.end + step;

        updateRangeValues(selectedRangeIndex, newValue);
    };

    const selectTextureEvent = (index) => {
        dispatch(selectTexture(index));
    };

    const renderGridLines = () => {
        const lines = [];
        const step = TOTAL_RANGE / 25;

        for (let i = 0; i <= 25; i++) {
            const value = Math.round(i * step);
            const position = (value / TOTAL_RANGE) * 100 * zoomLevel;

            lines.push(
                <div
                    key={i}
                    className="grid-tick"
                    style={{
                        bottom: `${position}%`,
                    }}
                >
                    <span>{value}</span>
                </div>
            );
        }
        return lines;
    };

    return (
        <div className="texture-range-container">
            <div className="range-bar" ref={rangeBarRef}>
                <div
                    className="grid-lines"
                    ref={gridRef}
                    style={{
                        transform: `translateY(${viewportOffset}px)`
                    }}
                >
                    {renderGridLines()}
                </div>
                {textures.map((texture, index) => (
                    <div
                        onClick={() => selectTextureEvent(index)}
                        key={texture.start + texture.end}
                        className={`texture-range ${
                            index === selectedRangeIndex ? "selected-range" : ""
                        }`}
                        style={{
                            bottom: `${(texture.start / TOTAL_RANGE) * 100 * zoomLevel + zoomOffset.y * 100}%`,
                            height: `${((texture.end - texture.start + 1) / TOTAL_RANGE) * 100 * zoomLevel}%`,
                        }}>
                        {/*<span className="texture-label">{texture.verticalTexture}/{texture.horizontalTexture}</span>*/}
                        {index !== textures.length - 1 && (
                            <div
                                className="handle handle-right"
                                onMouseDown={(e) => handleMouseDown(e, index)}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TextureRangeSelector;
