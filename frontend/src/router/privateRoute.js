import React from 'react';
import {Navigate, Route} from "react-router-dom"
import {LOGIN_LINK} from "./links";

const PrivateRoute = ({ children }) => {
    const isAuth = false;

    return isAuth ? children : <Navigate to={LOGIN_LINK} />;
}
export default PrivateRoute;
