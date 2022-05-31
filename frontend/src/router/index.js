import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {
    HOME_LINK,
    LOGIN_LINK,
    NEW_SEASON_LINK,
    PERSONAL_LINK,
    PROFILE_LINK,
    REG_LINK, SEASON_LINK,
    SEASONS_LINK,
    USER_LINK
} from "./links";
import PrivateRoute from "./privateRoute";
import Login from "../containers/Login";
import Home from "../containers/Home";
import {useSelector} from "react-redux";
import {isAuthSelector} from "../ducks/user";
import Registration from "../containers/Registration";
import Personal from "../containers/Personal";
import Profile from "../containers/Users/profile";
import User from "../containers/Users/user";
import Seasons from "../containers/Season/seasonsPage";
import SeasonForm from "../containers/Season/seasonForm";

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
            <Route path={USER_LINK}
                   element={
                       <PrivateRoute isAuth={isAuth}>
                           <User/>
                       </PrivateRoute>
                   }
            />
            <Route path={PROFILE_LINK}
                   element={
                       <PrivateRoute isAuth={isAuth}>
                           <Profile/>
                       </PrivateRoute>
                   }
            />
            <Route path={NEW_SEASON_LINK}
                   element={
                       <PrivateRoute admin isAuth={isAuth}>
                           <SeasonForm/>
                       </PrivateRoute>
                   }
            />
            <Route path={SEASON_LINK}
                   element={
                       <PrivateRoute admin isAuth={isAuth}>
                           <SeasonForm/>
                       </PrivateRoute>
                   }
            />
            <Route path={LOGIN_LINK} element={<Login/>}/>
            <Route path={REG_LINK} element={<Registration/>}/>
            <Route path={PERSONAL_LINK} element={<Personal/>}/>
            <Route path={SEASONS_LINK} element={<Seasons/>}/>
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
