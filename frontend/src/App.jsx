import React, {useState} from "react";

import Foliage from "@/modules/foliage/windows/Foliage.jsx";
import Texture from "@/modules/texture/windows/Texture.jsx";
import {Browser} from "@wailsio/runtime";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import Button from "@shared/components/ui/Button/Button.jsx";
import Modal from "@shared/components/ui/Modal/Modal.jsx";
import {useModal} from "@shared/hooks/useModal.js";
import Settings from "@shared/windows/Settings/Settings.jsx";
import Cutter from "@/modules/cutter/windows/Cutter.jsx";

function App() {
    const [activeTab, setActiveTab] = useState(0);

    const { t } = useTranslation();

    const loading = useSelector((state) => state.textureState.loading);

    const renderContent = () => {
        switch (activeTab) {
            case 0:
                return <Texture />;
            case 1:
                return <Foliage />;
            case 2:
                return <Cutter />;
            default:
                return null;
        }
    };

    const { isVisible, modalStyle, modalTitle, modalContent, openModal, closeModal } =
        useModal();

    const tabs = [
        {
            id: 0,
            icon: "images/nilfgaard-ribbon-ea60db11.jpg",
            loading: loading,
            onClick: () => setActiveTab(0),
        },
        {
            id: 1,
            icon: "images/scoia-ribbon-6874c516.jpg",
            loading: false,
            onClick: () => setActiveTab(1),
        },
        {
            id: 2,
            icon: "images/syndicate-ribbon-69f93c76.jpg",
            loading: false,
            onClick: () => setActiveTab(2),
        },
        {
            id: 3,
            icon: "images/monsters-ribbon-d0f23172.jpg",
            loading: false,
            position: "bottom",
            additionalIcon: "/images/icon/help.png",
            style: "fixed",
            onClick: () =>
                openModal(
                    "default",
                    t("main.openLink"),
                    <div>
                        <p>{t("main.doYouWantToOpenLink")}</p>
                        <div className="modal-actions">
                            <div className="mt-3 flex flex-row gap-2">
                                <Button
                                    className={"w-full py-1.5"}
                                    onClick={() => {
                                        Browser.OpenURL(t("helpLink"));
                                        closeModal();
                                    }}
                                    text={t("main.open")}></Button>
                                <Button
                                    className={"w-full py-1.5"}
                                    text={t("main.cancel")}
                                    onClick={closeModal}></Button>
                            </div>
                        </div>
                    </div>
                ),
        },
        {
            id: 4,
            icon: "images/monsters-ribbon-d0f23172.jpg",
            loading: false,
            additionalIcon: "/images/icon/settings.png",
            style: "fixed",
            onClick: () => openModal("default", t("main.settings"), <Settings />),
        },
    ];

    return (
        <>
            <div className={"h-full"}>
                <div className="flex h-full flex-row justify-center">
                    <div className="tab-links-container h-screen">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`tab-link ${activeTab === tab.id ? "tab-link-selected " : ""}${tab.loading ? "tab-link-loading " : ""}${tab.position === "bottom" ? "tab-link-bottom " : ""}${tab.style === "fixed" ? "tab-link-fixed" : ""}`}
                                style={{ backgroundImage: `url(${tab.icon})` }}
                                onClick={tab.onClick}>
                                {tab.additionalIcon && (
                                    <img
                                        src={tab.additionalIcon}
                                        alt="Additional Icon"
                                        className="additional-icon"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    {renderContent()}
                </div>
                <Modal
                    isVisible={isVisible}
                    onClose={closeModal}
                    title={modalTitle}
                    style={modalStyle}>
                    {modalContent}
                </Modal>
            </div>
        </>
    );
}

export default App;
