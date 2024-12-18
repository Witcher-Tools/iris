import {UPDATE_TEXTURES} from "../types/iris.js";

export const setIrisState = (payload) => {
    return {
        type: UPDATE_TEXTURES,
        payload,
    };
};

const TOTAL_RANGE = 255;

export const addTexture = (texture) => (dispatch, getState) => {
    const TOTAL_RANGE = 255;

    const currentTextures = getState().mainState.textures || [];

    const allTextures = [...currentTextures, texture];

    const totalTextures = allTextures.length;

    const recalculatedTextures = allTextures.map((texture, index) => ({
        ...texture,
        start: Math.floor((index / totalTextures) * (TOTAL_RANGE + 1)),
        end: Math.floor(((index + 1) / totalTextures) * (TOTAL_RANGE + 1)) - 1,
    }));

    dispatch(setIrisState({
        textures: recalculatedTextures
    }));
};

export const setTextures = (textures) => (dispatch, getState) => {
    dispatch(setIrisState({
        textures: textures,
    }));
};
