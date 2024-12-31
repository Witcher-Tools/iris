import React from "react";

import { twMerge } from "tailwind-merge";

import "./Button.css";

const Button = ({ text, onClick, disabled, icon, title, ...props }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={twMerge(
                "gwent-button text-base relative flex items-center justify-center py-3 tracking-wide",
                props?.className
            )}
            title={title}>
            <span>{text}</span>
            {icon ? (
                <div className={"icon"}>
                    <img src={icon} alt />
                </div>
            ) : null}
        </button>
    );
};

export default Button;
