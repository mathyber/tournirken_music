import {all, put, takeEvery} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {postman} from "../utils/postman";

// Types
const APP_REQUEST = 'APP_REQUEST';
const APP_SUCCESS = 'APP_SUCCESS';
const APP_ERROR = 'APP_ERROR';

const APPS_REQUEST = 'APPS_REQUEST';
const APPS_SUCCESS = 'APPS_SUCCESS';
const APPS_ERROR = 'APPS_ERROR';

const CHANGE_STATE_REQUEST = 'CHANGE_STATE_REQUEST';
const CHANGE_STATE_SUCCESS = 'CHANGE_STATE_SUCCESS';
const CHANGE_STATE_ERROR = 'CHANGE_STATE_ERROR';

const CREATE_EDIT_APP_REQUEST = 'CREATE_EDIT_APP_REQUEST';
const CREATE_EDIT_APP_SUCCESS = 'CREATE_EDIT_APP_SUCCESS';
const CREATE_EDIT_APP_ERROR = 'CREATE_EDIT_APP_ERROR';

const SET_STAGE_APPS_REQUEST = 'SET_STAGE_APPS_REQUEST';
const SET_STAGE_APPS_SUCCESS = 'SET_STAGE_APPS_SUCCESS';
const SET_STAGE_APPS_ERROR = 'SET_STAGE_APPS_ERROR';

// Initial State
const initial = {
    application: null,
    applications: {
        count: 0,
        items: []
    },
    loading: false
};

// Reducer
export default (state = initial, {type, payload}) => {
    switch (type) {
        case APP_REQUEST:
            return {
                ...state,
                loading: true
            };
        case APP_SUCCESS:
            return {
                ...state,
                application: payload,
                loading: false,
            };
        case APP_ERROR:
            return {
                ...state,
                loading: false,
            };
        case APPS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case APPS_SUCCESS:
            return {
                ...state,
                applications: payload,
                loading: false,
            };
        case APPS_ERROR:
            return {
                ...state,
                loading: false,
            };
        case CREATE_EDIT_APP_REQUEST:
            return {
                ...state,
                loading: true
            };
        case CREATE_EDIT_APP_SUCCESS:
            return {
                ...state,
                application: payload,
                loading: false,
            };
        case CREATE_EDIT_APP_ERROR:
            return {
                ...state,
                loading: false,
            };
        case CHANGE_STATE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CHANGE_STATE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case CHANGE_STATE_ERROR:
            return {
                ...state,
                loading: false,
            };
        case SET_STAGE_APPS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SET_STAGE_APPS_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case SET_STAGE_APPS_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}

// Actions Creators
export const getApp = payload => {
    return {
        type: APP_REQUEST,
        payload,
    };
}

export const setStagesApps = payload => {
    return {
        type: SET_STAGE_APPS_REQUEST,
        payload,
    };
}

export const getApps = payload => {
    return {
        type: APPS_REQUEST,
        payload,
    };
}

export const changeStateApp = payload => {
    return {
        type: CHANGE_STATE_REQUEST,
        payload,
    };
}

export const createOrEditApp = payload => {
    return {
        type: CREATE_EDIT_APP_REQUEST,
        payload,
    };
}

// Selectors
const stateSelector = state => state.app;
export const appSelector = createSelector(stateSelector, state => state.application);
export const appsSelector = createSelector(stateSelector, state => state.applications);
export const progressSelector = createSelector(stateSelector,state => state.loadingInfo);

// Saga
function* saveAppSaga({payload}) {
    try {
        const {formData, callback} = payload;
        const result = yield postman.post('/application/new', formData);
        yield put({
            type: CREATE_EDIT_APP_SUCCESS,
            payload: result
        });
        callback && callback();
    } catch ({response}) {
        yield put({
            type: CREATE_EDIT_APP_ERROR,
            payload: response.data,
        });
    }
}

function* appSaga({payload}) {
    try {
        const result = yield postman.get('/application/'+ payload);
        yield put({
            type: APP_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: APP_ERROR,
            payload: response.data,
        });
    }
}

function* appsSaga({payload}) {
    try {
        const result = yield postman.post('/application/applications/', payload);
        yield put({
            type: APPS_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: APPS_ERROR,
            payload: response.data,
        });
    }
}

function* changeStateSaga({payload}) {
    try {
        const {callback, id, newStatus} = payload;
        const result = yield postman.post('/application/status/', {id, newStatus});
        yield put({
            type: CHANGE_STATE_SUCCESS,
            payload: result
        });
        callback && callback();
    } catch ({response}) {
        yield put({
            type: CHANGE_STATE_ERROR,
            payload: response.data,
        });
    }
}

function* setStageAppsSaga({payload}) {
    try {
        const {form, callback} = payload;
        const result = yield postman.post('/application/setStages/', form);
        yield put({
            type: SET_STAGE_APPS_SUCCESS,
            payload: result
        });
        callback && callback();
    } catch ({response}) {
        yield put({
            type: SET_STAGE_APPS_ERROR,
            payload: response.data,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(CREATE_EDIT_APP_REQUEST, saveAppSaga),
        takeEvery(APP_REQUEST, appSaga),
        takeEvery(APPS_REQUEST, appsSaga),
        takeEvery(CHANGE_STATE_REQUEST, changeStateSaga),
        takeEvery(SET_STAGE_APPS_REQUEST, setStageAppsSaga),
    ]);
}