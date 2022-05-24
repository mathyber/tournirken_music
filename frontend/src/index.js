import React, {Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';
import './index.css';
import App from './App';
import {createRoot} from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <Suspense fallback="...loading">
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Suspense>
    </Provider>
);
