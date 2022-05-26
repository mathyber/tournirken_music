import {all, put, takeEvery} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {postman, setAccessToken} from "../utils/postman";
import {ACCESS_TOKEN} from "../constants";

// Types
const PROFILE_REQUEST = 'PROFILE_REQUEST';
const PROFILE_SUCCESS = 'PROFILE_SUCCESS';
const PROFILE_ERROR = 'PROFILE_ERROR';

const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT_REQUEST = 'LOGOUT_REQUEST';

// Initial State
const initial = {
    isAuth: Boolean(localStorage.getItem(ACCESS_TOKEN)),
    loginProgress: false,
    error: '',
    profile: {}
};

// Reducer
export default (state = initial, {type, payload}) => {
    switch (type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isAuth: false,
                loginProgress: true
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuth: true,
                loginProgress: false,
                error: ''
            };
        case LOGIN_ERROR:
            return {
                ...state,
                isAuth: false,
                loginProgress: false,
                error: payload
            };
        case PROFILE_REQUEST:
        case PROFILE_ERROR:
            return {
                ...state
            };
        case PROFILE_SUCCESS:
            return {
                ...state,
                profile: payload
            };
        default:
            return state;
    }
}

// Actions Creators
export const login = payload => {
    return {
        type: LOGIN_REQUEST,
        payload,
    };
}

export const profile = payload => {
    return {
        type: PROFILE_REQUEST,
        payload,
    };
}

export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    window.location.reload();
    return {
        type: LOGOUT_REQUEST,
    };
};

// Selectors
const stateSelector = state => state.user;
export const isAuthSelector = createSelector(stateSelector, state => state.isAuth);
export const loginProgressSelector = createSelector(stateSelector,state => state.loginProgress);
export const profileSelector = createSelector(stateSelector,state => state.profile);

// Saga
function* loginSaga({payload}) {
    try {
        const {form, callback} = payload;
        const result = yield postman.post('/user/login', form);
        localStorage.setItem(ACCESS_TOKEN, result.token);
        setAccessToken(result.token);
        yield put({
            type: LOGIN_SUCCESS,
        });
        callback && callback();
    } catch ({response}) {
        yield put({
            type: LOGIN_ERROR,
            payload: response.data,
        });
    }
}
function* profileSaga() {
    try {
        const result = yield postman.get('/user/profile');
        yield put({
            type: PROFILE_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: PROFILE_ERROR,
            payload: response.data,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(LOGIN_REQUEST, loginSaga),
        takeEvery(PROFILE_REQUEST, profileSaga),
    ]);
}