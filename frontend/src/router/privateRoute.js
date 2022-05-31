import React from 'react';
import {Navigate, Route} from "react-router-dom"
import {LOGIN_LINK} from "./links";

const PrivateRoute = ({ isAuth, children }) => {

    if (!isAuth) {
        return <Navigate to={LOGIN_LINK} replace />;
    }
    return children;
};

export default PrivateRoute;
