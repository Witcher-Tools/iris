import React, { Suspense } from "react";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "./i18n";
import "./index.css";
import Iris from "./modules/iris/pages/Iris.jsx";
import store from "./redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <Suspense fallback={"Loading..."}>
            <Iris />
        </Suspense>
    </Provider>
);
