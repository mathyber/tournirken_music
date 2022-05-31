import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import { default as user } from '../ducks/user';
import { default as contest } from '../ducks/contest';
import { default as season } from '../ducks/season';

export default history =>
    combineReducers({
        user,
        contest,
        season,
        router: connectRouter(history),
    });
