import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App/App.jsx'
import './index.css'
import './i18n';
import {Provider} from "react-redux";
import store from "./redux/store.js";

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <Suspense fallback={"Loading..."}>
            <App/>
        </Suspense>
    </Provider>,
)
