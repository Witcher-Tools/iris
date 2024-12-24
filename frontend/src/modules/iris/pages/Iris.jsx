import React, {useEffect, useRef, useState} from "react";

import {addTexture} from "@/redux/action/iris.js";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";

import {SelectTextureMap} from "@bindings/changeme/greetservice.js";
import Button from "@shared/components/ui/Button/Button.jsx";
import Card from "@shared/components/ui/Card/Card.jsx";
import Input from "@shared/components/ui/Input/Input.jsx";
import Separator from "@shared/components/ui/Separator/Separator.jsx";

import TextureRangeSelector from "../components/Range/Range.jsx";
import "./Iris.css";
import {useModal} from "@shared/hooks/useModal.js";
import Modal from "@shared/components/ui/Modal/Modal.jsx";
import {Import} from "@bindings/changeme/internal/iris/service/importer/importer.js";
import {ImportOptions} from "@bindings/changeme/internal/iris/service/importer/index.js";

function Iris() {
    const {t} = useTranslation();

    const {
        isVisible,
        modalStyle,
        modalTitle,
        modalContent,
        openModal,
        closeModal,
    } = useModal();

    const dispatch = useDispatch();

    const verticalTexture = useRef(null);
    const horizontalTexture = useRef(null);
    const slope = useRef(null);
    const scale = useRef(null);
    const canvasRef = useRef(null);

    const [imageSrc, setImageSrc] = useState(null);

    const textures = useSelector((state) => state.mainState.textures);
    const selectedTexture = useSelector((state) => state.mainState.selectedTexture);

    const importReady = useSelector((state) => state.mainState.importDisabled);

    const addTextureA = () => {
        const texture = {
            verticalTexture: verticalTexture.current.value,
            horizontalTexture: horizontalTexture.current.value,
            slope: slope.current.value,
            scale: scale.current.value,
            start: 0,
            end: 255,
            red: Math.floor(Math.random() * 255),
            green: Math.floor(Math.random() * 255),
            blue: Math.floor(Math.random() * 255),
        };

        dispatch(addTexture(texture));
    };

    const loadTiles = async () => {
        const importOptions = new ImportOptions({
            ImportFolder: "D:\\paf\\local_test\\workspace\\levels\\mylevel3\\terrain_tiles",
            TextureMap: "C:\\Users\\khevp\\OneDrive\\Документи\\Gaea\\Builds\\6\\031\\CLUTer – копія (2).png",
        });

        const res = await Import(importOptions);

        if (res === "") {
            openModal("success", t("main.success"), t("main.successImport"));
        } else {
            openModal("error", t("main.error"), res);
        }

        console.log(res);
    }

    const selectTextureMap = async () => {
        const response = await SelectTextureMap();

        const img = new Image();
        img.src = `data:image/png;base64,${response}`;

        setImageSrc(img.src);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (imageSrc === null) {
            return;
        }

        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                const greyscale = (r + g + b) / 3;

                if (selectedTexture !== null) {
                    const texture = textures[selectedTexture];
                    if (greyscale >= texture.start && greyscale <= texture.end) {
                        data[i] = 0;
                        data[i + 1] = 255;
                        data[i + 2] = 0;
                    }

                    continue;
                }

                for (let j = 0; j < textures.length; j++) {
                    if (greyscale >= textures[j].start && greyscale <= textures[j].end) {
                        data[i] = textures[j].red;
                        data[i + 1] = textures[j].green;
                        data[i + 2] = textures[j].blue;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
        };
    }, [textures, selectedTexture, imageSrc]);

    return (
        <>
            <div className="basis-4/12 2xl:basis-3/12 h-full relative z-2 ml-24">
                <Card>
                    <div className="flex flex-col content-between h-full justify-between">
                        <div className="flex flex-col gap-4">
                            <Input
                                label={t("main.verticalTexture")}
                                type="number"
                                min="1"
                                max="32"
                                className={"px-4 py-3"}
                                ref={verticalTexture}
                            />
                            <Input
                                label={t("main.horizontalTexture")}
                                type="number"
                                min="1"
                                max="32"
                                className={"px-4 py-3"}
                                ref={horizontalTexture}
                            />
                            <Input
                                label={t("main.slope")}
                                type="number"
                                min="1"
                                max="8"
                                className={"px-4 py-3"}
                                ref={slope}
                            />
                            <Input
                                label={t("main.scale")}
                                type="number"
                                min="1"
                                max="8"
                                className={"px-4 py-3"}
                                ref={scale}
                            />
                            <Button
                                className={"py-2 text-sm"}
                                disabled={false}
                                text={t("main.addTexture")}
                                onClick={addTextureA}
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <span className={"text-sm"}>
                                        {t("main.textureMap")}
                                    </span>
                                    <Button
                                        onClick={selectTextureMap}
                                        className={"py-2 text-sm"}
                                        text={t("main.selectTextureMap")}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className={"text-sm"}>
                                        {t("main.tilesFolder")}
                                    </span>
                                    <Button
                                        onClick={loadTiles}
                                        className={"py-2 text-sm"}
                                        text={t("main.selectTilesFolder")}
                                    />
                                    <Modal
                                        isVisible={isVisible}
                                        onClose={closeModal}
                                        title={modalTitle}
                                        style={modalStyle}
                                    >
                                        <p>{modalContent}</p>
                                    </Modal>
                                </div>
                            </div>
                            <Separator className={"my-4"}/>
                            <Button
                                disabled={importReady}
                                text={t("main.import")}
                            />
                        </div>
                    </div>
                </Card>
            </div>
            <div className="basis-8/12 2xl:basis-9/12 2xl:mr-24 flex justify-center">
                <div className="gwent-map">
                    <TextureRangeSelector/>
                    <div className={"map-container"}>
                        <canvas className={"map-canvas"} ref={canvasRef}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Iris;
