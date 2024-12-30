import React, {useState} from "react";
import Iris from "@/modules/texture/pages/Iris.jsx";
import Aelirenn from "@/modules/foliage/pages/Aelirenn.jsx";
import {useSelector} from "react-redux";
import {useModal} from "@shared/hooks/useModal.js";
import Modal from "@shared/components/ui/Modal/Modal.jsx";
import Settings from "@shared/windows/Settings/Settings.jsx";

function App() {
    const [activeTab, setActiveTab] = useState(0);

    const loading = useSelector((state) => state.textureState.loading);

    const renderContent = () => {
        switch (activeTab) {
            case 0:
                return <Iris/>;
            case 1:
                return <Aelirenn/>;
            case 2:
                return <Aelirenn/>;
            case 3:
                return <Aelirenn/>;
            default:
                return null;
        }
    };

    const {
        isVisible,
        modalStyle,
        modalTitle,
        modalContent,
        openModal,
        closeModal,
    } = useModal();

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
        // {
        //     id: 3,
        //     icon: "images/monsters-ribbon-d0f23172.jpg",
        //     loading: false,
        //     position: "bottom",
        //     additionalIcon: "images/icon/help.png",
        //     style: "fixed",
        //     onClick: () =>
        //         openModal(
        //             "default",
        //             "Open Link",
        //             <div>
        //                 <p>Do you want to open this link in your browser?</p>
        //                 <div className="modal-actions">
        //                     <div className="flex flex-row gap-2 mt-3">
        //                         <Button className={"py-1.5 w-full"} text={"Cancel"} onClick={closeModal}></Button>
        //                         <Button
        //                             className={"py-1.5 w-full"}
        //                             onClick={() => {
        //                                 Browser.OpenURL("https://w3redkit-community-doc.gitbook.io/witcher-3-redkit-docs/tools/scripts-editor");
        //                                 closeModal();
        //                             }}
        //                             text={"Confirm"}
        //                         >
        //                         </Button>
        //                     </div>
        //                 </div>
        //             </div>
        //         ),
        // },
        {
            id: 4,
            icon: "images/monsters-ribbon-d0f23172.jpg",
            loading: false,
            position: "bottom",
            additionalIcon: "images/icon/settings.png",
            style: "fixed",
            onClick: () =>
                openModal(
                    "default",
                    "Settings",
                    <Settings/>
                ),
        },
    ];


    return (
        <>
            <div className={"h-full"}>
                <div className="flex flex-row h-full justify-center">
                    <div className="tab-links-container h-screen">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`tab-link ${activeTab === tab.id ? "tab-link-selected " : ""}${tab.loading ? "tab-link-loading " : ""}${tab.position === "bottom" ? "tab-link-bottom " : ""}${tab.style === "fixed" ? "tab-link-fixed " : ""}`}
                                style={{ backgroundImage: `url(${tab.icon})` }}
                                onClick={tab.onClick}
                            >
                                {tab.additionalIcon && (
                                    <img src={tab.additionalIcon} alt="Additional Icon" className="additional-icon" />
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
                    style={modalStyle}
                >
                    {modalContent}
                </Modal>
            </div>
        </>);
}

export default App;