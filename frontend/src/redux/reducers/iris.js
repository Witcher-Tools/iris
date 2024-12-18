import {UPDATE_TEXTURES} from "../types/iris.js";

const initialState = {
    textures: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TEXTURES:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default reducer;