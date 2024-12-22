import PropTypes from "prop-types";
import React from "react";
import { twMerge } from "tailwind-merge";

import "./Button.css";

const CustomButton = ({ text, onClick, disabled, ...props }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={twMerge(
                "gwent-button relative py-3 w-72 text-base tracking-wide flex justify-center items-center",
                props?.className
            )}>
            <span>{text}</span>
        </button>
    );
};

CustomButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
};

CustomButton.defaultProps = {
    onClick: () => {},
    disabled: false,
};

export default CustomButton;
