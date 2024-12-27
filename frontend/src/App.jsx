import React, {useState} from "react";
import Iris from "@/modules/texture/pages/Iris.jsx";
import Aelirenn from "@/modules/foliage/pages/Aelirenn.jsx";
import {useSelector} from "react-redux";

function App() {
    const [activeTab, setActiveTab] = useState(0);

    const loading = useSelector((state) => state.textureState.loading);

    const renderContent = () => {
        switch (activeTab) {
            case 0:
                return <Iris/>;
            case 1:
                return <Aelirenn/>;
            default:
                return null;
        }
    };

    const tabs = [
        { id: 0, icon: "images/nilfgaard-ribbon-ea60db11.jpg", loading: loading},
        { id: 1, icon: "images/scoia-ribbon-6874c516.jpg", loading: false},
    ];

    return (
        <>
            <div className={"h-full"}>
                <div className="flex flex-row h-full justify-center">
                    <div className="tab-links-container">
                        {tabs.map((tab, index) => (
                            <div
                                key={tab.id}
                                className={`tab-link ${activeTab === index ? "tab-link-selected" : " "} ${tab.loading ? "tab-link-loading" : ""}`}
                                style={{backgroundImage: `url(${tab.icon})`}}
                                onClick={() => setActiveTab(index)}></div>
                        ))}
                    </div>
                    {renderContent()}
                </div>
            </div>
        </>);
}

export default App;