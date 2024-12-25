import {UPDATE_TEXTURES} from "../types/iris.js";

export const setIrisState = (payload) => {
    return {
        type: UPDATE_TEXTURES,
        payload,
    };
};

export const addTexture = (texture) => (dispatch, getState) => {
    const TOTAL_RANGE = 255;

    const currentTextures = getState().mainState.textures || [];

    if (currentTextures.length === 32) {
        return;
    }

    const allTextures = [...currentTextures, texture];

    const totalTextures = allTextures.length;

    const recalculatedTextures = allTextures.map((texture, index) => ({
        ...texture,
        start: Math.floor((index / totalTextures) * (TOTAL_RANGE + 1)),
        end: Math.floor(((index + 1) / totalTextures) * (TOTAL_RANGE + 1)) - 1,
    }));

    dispatch(
        setIrisState({
            textures: recalculatedTextures,
        })
    );
};

export const selectTexture = (textureIndex) => (dispatch, getState) => {
    dispatch(
        setIrisState({
            selectedTexture: textureIndex,
        })
    );
};

export const setTextures = (textures) => (dispatch, getState) => {
    dispatch(
        setIrisState({
            textures: textures,
        })
    );
};

export const setImportFolder = (importFolder) => (dispatch, getState) => {
    dispatch(
        setIrisState({
            importFolder: importFolder,
        })
    );
};

export const setImportTextureMap = (importTextureMap) => (dispatch, getState) => {
    dispatch(
        setIrisState({
            importTextureMap: importTextureMap,
        })
    );
};
