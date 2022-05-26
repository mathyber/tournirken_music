import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {HOME_LINK, LOGIN_LINK} from "./links";
import PrivateRoute from "./privateRoute";
import Login from "../containers/Login";
import Home from "../containers/Home";
import {useSelector} from "react-redux";
import {isAuthSelector} from "../ducks/user";

const MainRoute = () => {
    const isAuth = useSelector(isAuthSelector);

    return (
        <Routes>
            <Route path={HOME_LINK}
                   element={
                       <PrivateRoute isAuth={isAuth}>
                           <Home/>
                       </PrivateRoute>
                   }
            />
            <Route path={LOGIN_LINK} element={<Login/>}/>
            <Route path={'*'}
                   element={
                       <PrivateRoute isAuth={isAuth}>
                           <Home/>
                       </PrivateRoute>
                   }
            />
        </Routes>
    )
};

export default MainRoute;
