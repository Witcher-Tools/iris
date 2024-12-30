import React, {useEffect, useRef} from "react";

import {
    addTexture,
    setImportFolder,
    setImportTextureMap,
    setImportTextureMapSrc,
    setLoading,
    setTextures,
} from "@/redux/action/texture.js";
import {trimString} from "@/utils/string.js";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";

import {Texture as TextureModel} from "@bindings/changeme/internal/texture/model/texture/index.js";
import {
    Import,
    SelectImportFolder,
    SelectImportTextureMap,
} from "@bindings/changeme/internal/texture/service/importer/importer.js";
import {ImportOptions} from "@bindings/changeme/internal/texture/service/importer/index.js";

import Button from "@shared/components/ui/Button/Button.jsx";
import Card from "@shared/components/ui/Card/Card.jsx";
import Input from "@shared/components/ui/Input/Input.jsx";
import Modal from "@shared/components/ui/Modal/Modal.jsx";
import Separator from "@shared/components/ui/Separator/Separator.jsx";
import {useModal} from "@shared/hooks/useModal.js";

import TextureRangeSelector from "../components/Range/Range.jsx";
import "./Texture.css";

function Texture() {
    const { t } = useTranslation();

    const { isVisible, modalStyle, modalTitle, modalContent, openModal, closeModal } =
        useModal();

    const dispatch = useDispatch();

    const canvasRef = useRef(null);

    const textures = useSelector((state) => state.textureState.textures);
    const selectedTexture = useSelector((state) => state.textureState.selectedTexture);
    const importFolder = useSelector((state) => state.textureState.importFolder);
    const importTextureMap = useSelector((state) => state.textureState.importTextureMap);
    const importTextureMapSrc = useSelector(
        (state) => state.textureState.importTextureMapSrc
    );
    const loading = useSelector((state) => state.textureState.loading);

    const addTextureA = () => {
        const texture = {
            verticalTexture: 1,
            horizontalTexture: 1,
            slope: 1,
            scale: 1,
        };

        dispatch(addTexture(texture));
    };

    const doImport = async () => {
        dispatch(setLoading(true));
        const response = await Import(
            new ImportOptions({
                ImportFolder: importFolder,
                TextureMap: importTextureMap,
                Textures: textures.map((el) => new TextureModel(el)),
            })
        );
        dispatch(setLoading(false));

        if (response.Error !== null) {
            openModal(
                "error",
                t("main.error"),
                t(`texture.errors.${response.Error.Code}`)
            );
            return;
        }

        openModal("success", t("main.success"), t("texture.successImport"));
    };

    const selectImportFolder = async () => {
        const response = await SelectImportFolder();

        if (response.Error !== null) {
            openModal(
                "error",
                t("main.error"),
                t(`texture.errors.${response.Error.Code}`)
            );
            return;
        }

        dispatch(setImportFolder(response.Data.ImportFolder));
    };

    const selectImportTextureMap = async () => {
        dispatch(setLoading(true));
        const response = await SelectImportTextureMap();
        dispatch(setLoading(false));

        if (response.Error !== null) {
            openModal(
                "error",
                t("main.error"),
                t(`texture.errors.${response.Error.Code}`)
            );
            return;
        }

        dispatch(
            setImportTextureMapSrc(
                `data:image/png;base64,${response.Data.ImportTextureMapBase64}`
            )
        );
        dispatch(setImportTextureMap(response.Data.ImportTextureMap));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (importTextureMapSrc === null) {
            return;
        }

        const img = new Image();
        img.src = importTextureMapSrc;

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
                }
            }

            ctx.putImageData(imageData, 0, 0);
        };
    }, [textures, selectedTexture, importTextureMapSrc]);

    const handleInputChange = (field, value) => {
        if (selectedTexture === null) return;

        const updatedTexture = {
            ...textures[selectedTexture],
            [field]: parseInt(value) || 0,
        };

        const updatedTextures = [...textures];
        updatedTextures[selectedTexture] = updatedTexture;

        dispatch(setTextures(updatedTextures));
    };

    return (
        <>
            <div className="z-2 relative ml-24 h-full basis-4/12 2xl:basis-3/12">
                <Card>
                    <div className="flex h-full flex-col content-between justify-between">
                        <div className="flex flex-col gap-4">
                            <Input
                                label={t("texture.verticalTexture")}
                                type="number"
                                min="1"
                                max="32"
                                className={"px-4 py-3"}
                                value={textures[selectedTexture]?.verticalTexture || ""}
                                onChange={(e) =>
                                    handleInputChange("verticalTexture", e.target.value)
                                }
                            />
                            <Input
                                label={t("texture.horizontalTexture")}
                                type="number"
                                min="1"
                                max="32"
                                className={"px-4 py-3"}
                                value={textures[selectedTexture]?.horizontalTexture || ""}
                                onChange={(e) =>
                                    handleInputChange("horizontalTexture", e.target.value)
                                }
                            />
                            <Input
                                label={t("texture.slope")}
                                type="number"
                                min="1"
                                max="8"
                                className={"px-4 py-3"}
                                value={textures[selectedTexture]?.slope || ""}
                                onChange={(e) =>
                                    handleInputChange("slope", e.target.value)
                                }
                            />
                            <Input
                                label={t("texture.scale")}
                                type="number"
                                min="1"
                                max="8"
                                className={"px-4 py-3"}
                                value={textures[selectedTexture]?.scale || ""}
                                onChange={(e) =>
                                    handleInputChange("scale", e.target.value)
                                }
                            />
                            <Separator />
                            <Button
                                className={"py-2 text-sm"}
                                text={t("texture.addTexture")}
                                onClick={addTextureA}
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <span className={"text-gradient text-sm"}>
                                        {t("texture.textureMap") +
                                            trimString(importTextureMap)}
                                    </span>
                                    <Button
                                        disabled={loading}
                                        onClick={selectImportTextureMap}
                                        className={"py-2 text-sm"}
                                        text={t("texture.selectTextureMap")}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className={"text-gradient text-sm"}>
                                        {t("texture.tilesFolder") +
                                            trimString(importFolder)}
                                    </span>
                                    <Button
                                        onClick={selectImportFolder}
                                        className={"py-2 text-sm"}
                                        text={t("texture.selectTilesFolder")}
                                    />
                                    <Modal
                                        isVisible={isVisible}
                                        onClose={closeModal}
                                        title={modalTitle}
                                        style={modalStyle}>
                                        <p>{modalContent}</p>
                                    </Modal>
                                </div>
                            </div>
                            <Separator className={"my-4"} />
                            <Button
                                onClick={doImport}
                                disabled={
                                    importTextureMap === null ||
                                    importFolder === null ||
                                    loading ||
                                    textures.length === 0
                                }
                                text={t("main.import")}
                            />
                        </div>
                    </div>
                </Card>
            </div>
            <div className="flex basis-8/12 justify-center 2xl:mr-24 2xl:basis-9/12">
                <div className="gwent-map">
                    <TextureRangeSelector />
                    <div className={"map-container"}>
                        <canvas className={"map-canvas"} ref={canvasRef}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Texture;
