import React from "react";

import "./Modal.css";

const Modal = ({ isVisible, onClose, title, style = "default", children }) => {
    const handleOutsideClick = (e) => {
        if (e.target.id === "modal-overlay") {
            onClose();
        }
    };

    const titleClass = `modal-title ${style}`;

    return isVisible ? (
        <div id="modal-overlay" className="modal-overlay" onClick={handleOutsideClick}>
            <div className="modal-container">
                <div className={titleClass}>
                    <h3>{title}</h3>
                </div>
                <div className="modal-content w-full">{children}</div>
            </div>
        </div>
    ) : null;
};

export default Modal;
