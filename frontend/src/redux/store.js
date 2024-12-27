import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";

import reducer from "./reducers/iris.js";

const rootReducer = combineReducers({
    textureState: reducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;
