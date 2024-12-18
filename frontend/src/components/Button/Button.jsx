import React from "react";
import PropTypes from "prop-types";

import './Button.css'

const CustomButton = ({ text, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="gwent-button relative w-72 py-3 text-base tracking-wide flex justify-center items-center"
        >
            <span>{text}</span>
        </button>
    );
};

CustomButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};

CustomButton.defaultProps = {
    onClick: () => {},
};

export default CustomButton;
