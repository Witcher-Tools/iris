import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";

import reducer from "./reducers/texture.js";

const rootReducer = combineReducers({
    textureState: reducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;
