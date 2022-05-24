import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {HOME_LINK, LOGIN_LINK} from "./links";
import PrivateRoute from "./privateRoute";
import Login from "../containers/Login";
import Home from "../containers/Home";

const MainRoute = () => {
    return (
        <Routes>
            <Route path={LOGIN_LINK} element={<Login/>}/>
            <Route path={HOME_LINK}
                   element={<PrivateRoute>
                       <Home/>
                   </PrivateRoute>}/>
            <Route path='*'
                   element={<PrivateRoute>
                       <Home/>
                   </PrivateRoute>}/>
        </Routes>
    )
};

export default MainRoute;
