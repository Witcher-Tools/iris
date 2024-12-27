import {UPDATE_TEXTURES} from "../types/iris.js";

export const setTextureState = (payload) => {
    return {
        type: UPDATE_TEXTURES,
        payload,
    };
};

export const addTexture = (texture) => (dispatch, getState) => {
    const TOTAL_RANGE = 255;

    const currentTextures = getState().textureState.textures || [];

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
        setTextureState({
            textures: recalculatedTextures,
        })
    );
};

export const selectTexture = (textureIndex) => (dispatch, getState) => {
    dispatch(
        setTextureState({
            selectedTexture: textureIndex,
        })
    );
};

export const setTextures = (textures) => (dispatch, getState) => {
    dispatch(
        setTextureState({
            textures: textures,
        })
    );
};

export const setImportFolder = (importFolder) => (dispatch, getState) => {
    dispatch(
        setTextureState({
            importFolder: importFolder,
        })
    );
};

export const setImportTextureMap = (importTextureMap) => (dispatch, getState) => {
    dispatch(
        setTextureState({
            importTextureMap: importTextureMap,
        })
    );
};


export const setImportTextureMapSrc = (importTextureMapSrc) => (dispatch, getState) => {
    dispatch(
        setTextureState({
            importTextureMapSrc: importTextureMapSrc,
        })
    );
};

export const setLoading = (loading) => (dispatch, getState) => {
    dispatch(
        setTextureState({
            loading: loading,
        })
    );
};
