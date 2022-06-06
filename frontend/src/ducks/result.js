import {all, put, takeEvery} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {postman} from "../utils/postman";

// Types
const GET_RESULT_REQUEST = 'GET_RESULT_REQUEST';
const GET_RESULT_SUCCESS = 'GET_RESULT_SUCCESS';
const GET_RESULT_ERROR = 'GET_RESULT_ERROR';

const GET_RESULT_VOTES_REQUEST = 'GET_RESULT_VOTES_REQUEST';
const GET_RESULT_VOTES_SUCCESS = 'GET_RESULT_VOTES_SUCCESS';
const GET_RESULT_VOTES_ERROR = 'GET_RESULT_VOTES_ERROR';

// Initial State
const initial = {
    loading: false,
    resultData: null,
    resultVotes: {},
};

// Reducer
export default (state = initial, {type, payload}) => {
    switch (type) {
        case GET_RESULT_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_RESULT_SUCCESS:
            return {
                ...state,
                resultData: payload,
                loading: false,
            };
        case GET_RESULT_ERROR:
            return {
                ...state,
                loading: false,
            };
        case GET_RESULT_VOTES_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_RESULT_VOTES_SUCCESS:
            return {
                ...state,
                resultVotes: payload,
                loading: false,
            };
        case GET_RESULT_VOTES_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}

// Actions Creators
export const getResult = payload => {
    return {
        type: GET_RESULT_REQUEST,
        payload,
    };
}
export const getResultVotes = payload => {
    return {
        type: GET_RESULT_VOTES_REQUEST,
        payload,
    };
}

// Selectors
const stateSelector = state => state.result;
export const resultDataSelector = createSelector(stateSelector, state => state.resultData);
export const resultVotesSelector = createSelector(stateSelector, state => state.resultVotes);
export const progressSelector = createSelector(stateSelector,state => state.loading);

// Saga
function* resultSaga({payload}) {
    try {
        const {id, data, callback} = payload;
        const result = yield postman.post(`/result/${id}`, data);
        yield put({
            type: GET_RESULT_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: GET_RESULT_ERROR,
            payload: response.data,
        });
    }
}

function* resultVotesSaga({payload}) {
    try {
        const {id, data, callback} = payload;
        const result = yield postman.post(`/result/${id}/table`, data);
        yield put({
            type: GET_RESULT_VOTES_SUCCESS,
            payload: result
        });
        callback && callback();
    } catch ({response}) {
        yield put({
            type: GET_RESULT_VOTES_ERROR,
            payload: response.data,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(GET_RESULT_REQUEST, resultSaga),
        takeEvery(GET_RESULT_VOTES_REQUEST, resultVotesSaga),
    ]);
}