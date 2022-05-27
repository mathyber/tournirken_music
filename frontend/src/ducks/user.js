import {all, put, takeEvery} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {postman, setAccessToken} from "../utils/postman";
import {ACCESS_TOKEN} from "../constants";

// Types
const PROFILE_REQUEST = 'PROFILE_REQUEST';
const PROFILE_SUCCESS = 'PROFILE_SUCCESS';
const PROFILE_ERROR = 'PROFILE_ERROR';

const REG_REQUEST = 'REG_REQUEST';
const REG_SUCCESS = 'REG_SUCCESS';
const REG_ERROR = 'REG_ERROR';

const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';
const LOGOUT_REQUEST = 'LOGOUT_REQUEST';

// Initial State
const initial = {
    isAuth: Boolean(localStorage.getItem(ACCESS_TOKEN)),
    loginProgress: false,
    regProgress: false,
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
        case REG_REQUEST:
            return {
                ...state,
                regProgress: true
            };
        case REG_SUCCESS:
            return {
                ...state,
                isAuth: true,
                regProgress: false
            };
        case REG_ERROR:
            return {
                ...state,
                regProgress: false
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
export const regUser = payload => {
    return {
        type: REG_REQUEST,
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
export const regProgressSelector = createSelector(stateSelector,state => state.regProgress);
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

function* regSaga({payload}) {
    try {
        const {form, callback} = payload;
        const result = yield postman.post('/user/registration', form);
        localStorage.setItem(ACCESS_TOKEN, result.token);
        setAccessToken(result.token);
        yield put({
            type: REG_SUCCESS,
            payload: result
        });
        callback && callback();

    } catch ({response}) {
        yield put({
            type: REG_ERROR,
            payload: response.data,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(LOGIN_REQUEST, loginSaga),
        takeEvery(PROFILE_REQUEST, profileSaga),
        takeEvery(REG_REQUEST, regSaga),
    ]);
}