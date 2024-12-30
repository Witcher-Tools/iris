import {UPDATE_TEXTURES} from "../types/texture.js";

const initialState = {
    textures: [],
    selectedTexture: null,
    highlightedTexture: null,

    importFolder: null,
    importTextureMap: null,

    loading: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TEXTURES:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default reducer;
