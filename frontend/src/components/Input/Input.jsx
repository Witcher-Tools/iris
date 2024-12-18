import React, {forwardRef, useState} from "react";
import "./Input.css";
import PropTypes from "prop-types";

const Input = forwardRef(({ label, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={"gwent-input-container"}>
            {label &&
                <label>{label}</label>
            }
            <div className={`gwent-input ${isFocused ? "focused" : ""}`}>
                <input
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
