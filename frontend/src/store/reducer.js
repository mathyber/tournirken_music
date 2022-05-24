import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

//import { default as user } from '../ducks/user';

export default history =>
    combineReducers({
        //user,
        router: connectRouter(history),
    });
