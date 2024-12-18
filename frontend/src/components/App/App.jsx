import CustomButton from "../Button/Button.jsx";
import Card from "../Card/Card.jsx";
import Input from "../Input/Input.jsx";
import Map from "../Map/Map.jsx";

import './App.css'
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {addTexture} from "../../redux/action/iris.js";
import TextureRangeSelector from "../Range/Range.jsx";
import Range from "../Range/Range.jsx";

function App() {
    const {t, i18n} = useTranslation();

    const verticalTexture = useRef(null);
    const horizontalTexture = useRef(null);
    const slope = useRef(null);
    const scale = useRef(null);

    const dispatch = useDispatch();

    const addTextureA = () => {
        const texture = {
            verticalTexture: verticalTexture.current.value,
            horizontalTexture: horizontalTexture.current.value,
            slope: slope.current.value,
            scale: scale.current.value,
            start: 0,
            end: 255
        }

        dispatch(addTexture(texture));
    }

    return (
        <>
            <div className={"container mx-auto h-full"}>
                <div className="flex flex-row h-full justify-center">
                    <div className="basis-2/12 h-full">
                        <Card>
                            <div className="flex flex-col content-between h-full justify-between">
                                <div className="grid grid-rows-4 gap-4">
                                    <Input label={t("main.verticalTexture")} type="number" min="1" max="32"
                                           className={"px-4 py-3"}
                                           ref={verticalTexture}
                                    />
                                    <Input label={t("main.horizontalTexture")} type="number" min="1" max="32"
                                           className={"px-4 py-3"}
                                           ref={horizontalTexture}
                                    />
                                    <Input label={t("main.slope")} type="number" min="1" max="8"
                                           className={"px-4 py-3"}
                                           ref={slope}
                                    />
                                    <Input label={t("main.scale")} type="number" min="1" max="8"
                                           className={"px-4 py-3"}
                                           ref={scale}
                                    />
                                    <CustomButton text={t("main.verticalTexture")} onClick={addTextureA}/>
                                </div>
                                <CustomButton text={"ИМПОРТИРОВАТЬ КАРТУ"}/>
                            </div>
                        </Card>
                    </div>
                    <div className="basis-10/12 flex justify-end">
                        <Map tiles={16} imageSrc={"images/CLUTer.png"}>
                            <TextureRangeSelector/>
                        </Map>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
