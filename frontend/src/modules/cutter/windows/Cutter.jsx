import Card from "@shared/components/ui/Card/Card.jsx";
import Paragraph from "@shared/components/ui/Paragraph/Paragraph.jsx";
import React from "react";
import {Trans, useTranslation} from "react-i18next";

const Cutter = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="relative z-10 ml-24 h-full basis-4/12 2xl:basis-3/12">
                <Card>
                    <Paragraph className={"italic"}>
                        <Trans i18nKey={"cutter.description"} components={{ br: <br /> }} />
                    </Paragraph>
                </Card>
            </div>
            <div className="flex basis-8/12 justify-center 2xl:mr-24 2xl:basis-9/12">
                <div className="gwent-map"></div>
            </div>
        </>
    );
};

export default Cutter;
