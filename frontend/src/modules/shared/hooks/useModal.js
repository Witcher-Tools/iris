import {useCallback, useState} from "react";

export const useModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    const openModal = useCallback(() => setIsVisible(true), []);
    const closeModal = useCallback(() => setIsVisible(false), []);

    return {
        isVisible,
        openModal,
        closeModal,
    };
};
