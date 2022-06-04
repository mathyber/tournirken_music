import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {
    APP_LINK, APPS_LINK,
    HOME_LINK,
    LOGIN_LINK, NEW_APP_LINK,
    NEW_SEASON_LINK,
    PERSONAL_LINK,
    PROFILE_LINK,
    REG_LINK, SEASON_LINK, SEASON_SETTINGS_LINK,
    SEASONS_LINK, STAGE_LINK,
    USER_LINK, VOTE_LINK
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
import NewAppPage from "../containers/Application/newAppPage";
import AppsPage from "../containers/Application/appsPage";
import SeasonSettings from "../containers/Season/seasonSettings";
import StageSettings from "../containers/Season/stageSettings";
import Vote from "../containers/Vote";

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
            <Route path={NEW_APP_LINK}
                   element={
                       <PrivateRoute admin isAuth={isAuth}>
                           <NewAppPage/>
                       </PrivateRoute>
                   }
            />
            <Route path={APPS_LINK}
                   element={
                       <PrivateRoute admin isAuth={isAuth}>
                           <AppsPage/>
                       </PrivateRoute>
                   }
            />
            <Route path={SEASON_SETTINGS_LINK}
                   element={
                       <PrivateRoute admin isAuth={isAuth}>
                           <SeasonSettings semifinalsSettings/>
                       </PrivateRoute>
                   }
            />
            <Route path={STAGE_LINK}
                   element={
                       <PrivateRoute admin isAuth={isAuth}>
                           <StageSettings/>
                       </PrivateRoute>
                   }
            />
            <Route path={VOTE_LINK}
                   element={
                       <PrivateRoute admin isAuth={isAuth}>
                           <Vote/>
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
