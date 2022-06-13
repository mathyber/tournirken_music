import {all, put, takeEvery} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {postman, setAccessToken} from "../utils/postman";
import {ACCESS_TOKEN} from "../constants";

// Types
const PROFILE_REQUEST = 'PROFILE_REQUEST';
const PROFILE_SUCCESS = 'PROFILE_SUCCESS';
const PROFILE_ERROR = 'PROFILE_ERROR';

const USER_REQUEST = 'USER_REQUEST';
const USER_SUCCESS = 'USER_SUCCESS';
const USER_ERROR = 'USER_ERROR';

const USERS_REQUEST = 'USERS_REQUEST';
const USERS_SUCCESS = 'USERS_SUCCESS';
const USERS_ERROR = 'USERS_ERROR';

const NEW_PASSWORD_REQUEST = 'NEW_PASSWORD_REQUEST';
const NEW_PASSWORD_SUCCESS = 'NEW_PASSWORD_SUCCESS';
const NEW_PASSWORD_ERROR = 'NEW_PASSWORD_ERROR';

const REG_REQUEST = 'REG_REQUEST';
const REG_SUCCESS = 'REG_SUCCESS';
const REG_ERROR = 'REG_ERROR';

const BAN_REQUEST = 'BAN_REQUEST';
const BAN_SUCCESS = 'BAN_SUCCESS';
const BAN_ERROR = 'BAN_ERROR';

const NEW_ROLE_REQUEST = 'NEW_ROLE_REQUEST';
const NEW_ROLE_SUCCESS = 'NEW_ROLE_SUCCESS';
const NEW_ROLE_ERROR = 'NEW_ROLE_ERROR';

const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR';

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
    profile: {},
    saveLoading: false,
    user: {},
    users: [],
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
        case USER_REQUEST:
            return {
                ...state,
                saveLoading: true
            };
        case USER_SUCCESS:
            return {
                ...state,
                user: payload,
                saveLoading: false
            };
        case USER_ERROR:
            return {
                ...state,
                user: {},
                saveLoading: false
            };
        case USERS_REQUEST:
            return {
                ...state,
                saveLoading: true
            };
        case USERS_SUCCESS:
            return {
                ...state,
                users: payload,
                saveLoading: false
            };
        case USERS_ERROR:
            return {
                ...state,
                users: [],
                saveLoading: false
            };
        case NEW_PASSWORD_REQUEST:
        case UPDATE_USER_REQUEST:
        case BAN_REQUEST:
        case NEW_ROLE_REQUEST:
            return {
                ...state,
                saveLoading: true
            };
        case NEW_PASSWORD_SUCCESS:
        case NEW_PASSWORD_ERROR:
        case UPDATE_USER_SUCCESS:
        case UPDATE_USER_ERROR:
        case BAN_ERROR:
        case BAN_SUCCESS:
        case NEW_ROLE_ERROR:
        case NEW_ROLE_SUCCESS:
            return {
                ...state,
                saveLoading: false
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

export const newPassword = payload => {
    return {
        type: NEW_PASSWORD_REQUEST,
        payload,
    };
}

export const updateUser = payload => {
    return {
        type: UPDATE_USER_REQUEST,
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

export const userById = payload => {
    return {
        type: USER_REQUEST,
        payload,
    };
}

export const banUserById = payload => {
    return {
        type: BAN_REQUEST,
        payload,
    };
}

export const newRoleForUser = payload => {
    return {
        type: NEW_ROLE_REQUEST,
        payload,
    };
}

export const getUsers = payload => {
    return {
        type: USERS_REQUEST,
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
export const isAdminSelector = createSelector(stateSelector, state => state.profile && state.profile.roles && state.profile.roles.includes('ADMIN'));
export const loginProgressSelector = createSelector(stateSelector,state => state.loginProgress);
export const saveProgressSelector = createSelector(stateSelector,state => state.saveLoading);
export const regProgressSelector = createSelector(stateSelector,state => state.regProgress);
export const profileSelector = createSelector(stateSelector,state => state.profile);
export const userSelector = createSelector(stateSelector,state => state.user);
export const usersSelector = createSelector(stateSelector,state => state.users);

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

function* userSaga({payload}) {
    try {
        const result = yield postman.get(`/user/user?id=${payload.id}`);
        yield put({
            type: USER_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: USER_ERROR,
            payload: response.data,
        });
    }
}

function* usersSaga({payload}) {
    try {
        const result = yield postman.post(`/user/users`, payload);
        yield put({
            type: USERS_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: USERS_ERROR,
            payload: response.data,
        });
    }
}

function* banUserSaga({payload}) {
    try {
        const {id, callback} = payload;
        const result = yield postman.post(`/user/deactive_user?id=${id}`);
        yield put({
            type: BAN_SUCCESS,
            payload: result
        });
        callback && callback();
    } catch ({response}) {
        yield put({
            type: BAN_ERROR,
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

function* newPasswordSaga({payload}) {
    try {
        const {form, callback} = payload;
        const result = yield postman.post('/user/new_password', form);
        setAccessToken(result.token);
        yield put({
            type: NEW_PASSWORD_SUCCESS,
            payload: result
        });
        callback && callback();

    } catch ({response}) {
        yield put({
            type: NEW_PASSWORD_ERROR,
            payload: response.data,
        });
    }
}

function* updateUserSaga({payload}) {
    try {
        const {form, callback} = payload;
        const result = yield postman.post('/user/update', form);
        yield put({
            type: UPDATE_USER_SUCCESS,
            payload: result
        });
        callback && callback();

    } catch ({response}) {
        yield put({
            type: UPDATE_USER_ERROR,
            payload: response.data,
        });
    }
}

function* updateRoleSaga({payload}) {
    try {
        const {id, form, callback} = payload;
        const result = yield postman.post(`/user/new_role?id=${id}`, form);
        yield put({
            type: NEW_ROLE_SUCCESS,
            payload: result
        });
        callback && callback();

    } catch ({response}) {
        yield put({
            type: NEW_ROLE_ERROR,
            payload: response.data,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(LOGIN_REQUEST, loginSaga),
        takeEvery(PROFILE_REQUEST, profileSaga),
        takeEvery(REG_REQUEST, regSaga),
        takeEvery(NEW_PASSWORD_REQUEST, newPasswordSaga),
        takeEvery(UPDATE_USER_REQUEST, updateUserSaga),
        takeEvery(USER_REQUEST, userSaga),
        takeEvery(BAN_REQUEST, banUserSaga),
        takeEvery(NEW_ROLE_REQUEST, updateRoleSaga),
        takeEvery(USERS_REQUEST, usersSaga),
    ]);
}