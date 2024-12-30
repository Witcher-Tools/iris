import { useCallback, useState } from "react";

export const useModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [modalStyle, setModalStyle] = useState("default");
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");

    const openModal = useCallback((style = "default", title = "", content = "") => {
        setModalStyle(style);
        setModalTitle(title);
        setModalContent(content);
        setIsVisible(true);
    }, []);

    const closeModal = useCallback(() => setIsVisible(false), []);

    return {
        isVisible,
        modalStyle,
        modalTitle,
        modalContent,
        openModal,
        closeModal,
    };
};
