import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import {default as user} from '../ducks/user';
import {default as contest} from '../ducks/contest';
import {default as season} from '../ducks/season';
import {default as app} from '../ducks/application';
import {default as vote} from '../ducks/vote';

export default history =>
    combineReducers({
        user,
        contest,
        season,
        app,
        vote,
        router: connectRouter(history),
    });
