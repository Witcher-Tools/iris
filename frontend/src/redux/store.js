import { combineReducers } from "redux";
import {configureStore} from "@reduxjs/toolkit";
import reducer from "./reducers/iris.js";

const rootReducer = combineReducers({
    mainState: reducer,
});

const store = configureStore(
    {
        reducer: rootReducer,
    }
);

export default store;