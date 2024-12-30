import React from "react";
import Select from "@shared/components/ui/Select/Select.jsx";
import {useTranslation} from "react-i18next";

function Settings() {
    const {t, i18n} = useTranslation()

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value).then(r => console.log(r))
    }

    return (
        <div>
            <Select options={[
                {
                    value: "en",
                    label: "English",
                },
                {
                    value: "ua",
                    label: "Українська",
                }
            ]} label={t("main.language")} onChange={(e) => changeLanguage(e)} />
        </div>
    );
}

export default Settings;