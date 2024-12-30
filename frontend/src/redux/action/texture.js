import {UPDATE_TEXTURES} from "../types/texture.js";

export const setTextureState = (payload) => {
    return {
        type: UPDATE_TEXTURES,
        payload,
    };
};

let highlightTimer = null;

export const addTexture = (texture) => (dispatch, getState) => {
    const TOTAL_RANGE = 255;

    const currentTextures = getState().textureState.textures || [];

    if (currentTextures.length === 96) {
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
            highlightedTexture: totalTextures - 1,
        })
    );

    if (highlightTimer) {
        clearTimeout(highlightTimer);
    }

    highlightTimer = setTimeout(() => {
        dispatch(
            setTextureState({
                highlightedTexture: null,
            })
        );
    }, 1000);
};

export const selectTexture = (textureIndex) => (dispatch, getState) => {
    dispatch(
        setTextureState({
            selectedTexture: textureIndex,
        })
    );
};

export const highlightTexture = (highlightedTexture) => (dispatch, getState) => {
    dispatch(
        setTextureState({
            highlightedTexture: highlightedTexture,
        })
    );
};

export const insertTexture = (textureIndex) => (dispatch, getState) => {
    const state = getState();
    const textures = state.textureState.textures;

    if (textureIndex < 0 || textureIndex >= textures.length) return;

    const textureToSplit = textures[textureIndex];

    if (textureToSplit.end - textureToSplit.start === 0) return;

    const middle = Math.floor((textureToSplit.start + textureToSplit.end) / 2);

    const newTexture1 = {
        ...textureToSplit,
        start: textureToSplit.start,
        end: middle,
    };

    const newTexture2 = {
        ...textureToSplit,
        start: middle + 1,
        end: textureToSplit.end,
    };

    const updatedTextures = [
        ...textures.slice(0, textureIndex),
        newTexture1,
        newTexture2,
        ...textures.slice(textureIndex + 1),
    ];

    dispatch(
        setTextureState({
            textures: updatedTextures,
        })
    );
};

export const deleteTexture = (textureIndex) => (dispatch, getState) => {
    const state = getState();
    const textures = state.textureState.textures;

    if (textureIndex < 0 || textureIndex >= textures.length) return;

    const updatedTextures = textures.map((texture, index) => {
        if (index === textureIndex - 1) {
            return { ...texture, end: textures[textureIndex].end };
        }
        if (index === textureIndex + 1 && textureIndex === 0) {
            return {...texture, start: textures[textureIndex].start};
        }
        return texture;
    });

    dispatch(
        setTextureState({
            textures: updatedTextures.filter((texture, index) => index !== textureIndex),
            selectedTexture: textureIndex - 1,
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
