import React, { useState } from "react";

import "./TabLink.css";

const TabLink = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 0, icon: "images/nilfgaard-ribbon-ea60db11.jpg" },
        { id: 1, icon: "images/syndicate-ribbon-69f93c76.jpg" },
        { id: 2, icon: "images/scoia-ribbon-6874c516.jpg" },
    ];

    const handleClick = (index) => {
        setActiveTab(index);
    };

    return (
        <div className="tab-links-container">
            {tabs.map((tab, index) => (
                <div
                    key={tab.id}
                    className={`tab-link ${activeTab === index ? "tab-link-selected" : ""}`}
                    style={{ backgroundImage: `url(${tab.icon})` }}
                    onClick={() => handleClick(index)}></div>
            ))}
        </div>
    );
};

export default TabLink;
