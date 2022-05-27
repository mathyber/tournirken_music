import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import { default as user } from '../ducks/user';
import { default as contest } from '../ducks/contest';

export default history =>
    combineReducers({
        user,
        contest,
        router: connectRouter(history),
    });
