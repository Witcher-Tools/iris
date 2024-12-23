import React, {Suspense} from "react";

import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";

import "./i18n";
import "./index.css";
import store from "./redux/store.js";
import App from "@/App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <Suspense fallback={"Loading..."}>
            <App />
        </Suspense>
    </Provider>
);
