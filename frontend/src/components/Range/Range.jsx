import React, {useEffect, useRef} from "react";
import "./Range.css";
import {useDispatch, useSelector} from "react-redux";
import {setTextures} from "../../redux/action/iris.js";

const TOTAL_RANGE = 255;

const TextureRangeSelector = () => {
    const rangeBarRef = useRef(null);

    const dispatch = useDispatch()
    const textures = useSelector((state) => state.mainState.textures);

    useEffect(() => {
        console.log(textures);
    }, [textures]);

    const handleMouseDown = (e, index) => {
        const rangeBar = rangeBarRef.current;
        const rangeBarWidth = rangeBar.offsetWidth;

        const onMouseMove = (moveEvent) => {
            const rect = rangeBar.getBoundingClientRect();
            const cursorX = moveEvent.clientX - rect.left;
            const newValue = Math.round((cursorX / rangeBarWidth) * TOTAL_RANGE);

            const updatedTextures = textures.map((texture, i) => {
                if (i === index) {
                    const maxRight = i < textures.length - 1 ? textures[i + 1].end - 1 : TOTAL_RANGE;
                    const minLeft = i > 0 ? texture.start : 1;
                    console.log(Math.max(Math.min(newValue, maxRight), minLeft));

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

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    return (
        <div className="texture-range-container">
            <div className="range-bar" ref={rangeBarRef}>
                <div className="grid-lines">
                    {Array.from({length: 26}, (_, i) => (
                        <div key={i} className="grid-tick" style={{left: `${(i / 25) * 100}%`}}>
                            <span>{Math.round((i / 25) * TOTAL_RANGE)}</span>
                        </div>
                    ))}
                </div>

                {textures.map((texture, index) => (
                    <div
                        key={texture.start + texture.end}
                        className="texture-range"
                        style={{
                            left: `${(texture.start / TOTAL_RANGE) * 100}%`,
                            width: `${((texture.end - texture.start) / TOTAL_RANGE) * 100}%`,
                        }}
                    >
                        <span className="texture-label">{texture.vertical}</span>

                        {index !== textures.length - 1 &&
                            <div className="handle handle-right"
                                 onMouseDown={(e) => handleMouseDown(e, index)}></div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

const getRandomGradient = () => {
    const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
    const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
    return `linear-gradient(to top, ${randomColor1}, ${randomColor2}00)`; // Second color is semi-transparent
};

export default TextureRangeSelector;
