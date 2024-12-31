import React, {forwardRef, useState} from "react";

import PropTypes from "prop-types";

import "./Input.css";

const Input = forwardRef(({ label, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
        }
    };

    return (
        <div className={"gwent-input-container"}>
            {label && <label>{label}</label>}
            <div className={`gwent-input ${isFocused ? "focused" : ""}`}>
                <input
                    onKeyDown={(e) => handleKeyDown(e)}
                    ref={ref}
                    {...props}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </div>
        </div>
    );
});

Input.propTypes = {
    label: PropTypes.string,
};

export default Input;
