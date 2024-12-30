import React from "react";

const Select = ({options, value, defaultValue, onChange, id, name, className, ariaLabel, label}) => {
    return (
        <div className={"gwent-input-container"}>
            {label && <label>{label}</label>}
            <div className={"gwent-input py-2 px-3"}>
                <select
                    id={id}
                    name={name}
                    className={className || "gwent-input"}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    aria-label={ariaLabel || "Select an option"}
                >
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Select;