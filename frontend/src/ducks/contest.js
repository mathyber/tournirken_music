import {all, put, takeEvery} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {postman} from "../utils/postman";

// Types
const CONTEST_INFO_REQUEST = 'CONTEST_INFO_REQUEST';
const CONTEST_INFO_SUCCESS = 'CONTEST_INFO_SUCCESS';
const CONTEST_INFO_ERROR = 'CONTEST_INFO_ERROR';

// Initial State
const initial = {
    name: '',
    description: '',
    loadingInfo: false
};

// Reducer
export default (state = initial, {type, payload}) => {
    switch (type) {
        case CONTEST_INFO_REQUEST:
            return {
                ...state,
                loadingInfo: true
            };
        case CONTEST_INFO_SUCCESS:
            return {
                ...state,
                ...payload,
                loadingInfo: false,
            };
        case CONTEST_INFO_ERROR:
            return {
                ...state,
                loadingInfo: false,
            };
        default:
            return state;
    }
}

// Actions Creators
export const getInfo = payload => {
    return {
        type: CONTEST_INFO_REQUEST,
        payload,
    };
}

// Selectors
const stateSelector = state => state.contest;
export const infoSelector = createSelector(stateSelector, state => ({
    name: state.name,
    description: state.description,
    seasons: state.seasons
}));
export const progressSelector = createSelector(stateSelector,state => state.loadingInfo);

// Saga
function* infoSaga() {
    try {
        const result = yield postman.get('/contest/contestData');
        yield put({
            type: CONTEST_INFO_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: CONTEST_INFO_ERROR,
            payload: response.data,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(CONTEST_INFO_REQUEST, infoSaga),
    ]);
}