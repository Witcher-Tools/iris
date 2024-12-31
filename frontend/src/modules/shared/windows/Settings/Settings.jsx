import React from "react";

import { useTranslation } from "react-i18next";

import Select from "@shared/components/ui/Select/Select.jsx";

function Settings() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value).then((r) => console.log(r));
    };

    return (
        <div>
            <Select
                options={[
                    {
                        value: "en",
                        label: "English",
                    },
                    {
                        value: "ua",
                        label: "Українська",
                    },
                    {
                        value: "ru",
                        label: "Русский",
                    },
                ]}
                label={t("main.language")}
                value={i18n.language}
                labelClassName={"label-dark"}
                onChange={(e) => changeLanguage(e)}
            />
        </div>
    );
}

export default Settings;
