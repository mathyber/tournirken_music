import {all, put, takeEvery} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {postman} from "../utils/postman";

// Types
const VOTE_SYSTEM_REQUEST = 'VOTE_SYSTEM_REQUEST';
const VOTE_SYSTEM_SUCCESS = 'VOTE_SYSTEM_SUCCESS';
const VOTE_SYSTEM_ERROR = 'VOTE_SYSTEM_ERROR';

const VOTE_REQUEST = 'VOTE_REQUEST';
const VOTE_SUCCESS = 'VOTE_SUCCESS';
const VOTE_ERROR = 'VOTE_ERROR';

const DELETE_VOTE_REQUEST = 'DELETE_VOTE_REQUEST';
const DELETE_VOTE_SUCCESS = 'DELETE_VOTE_SUCCESS';
const DELETE_VOTE_ERROR = 'DELETE_VOTE_ERROR';

// Initial State
const initial = {
    voteSystem: [],
    loading: false
};

// Reducer
export default (state = initial, {type, payload}) => {
    switch (type) {
        case VOTE_SYSTEM_REQUEST:
            return {
                ...state,
                loading: true
            };
        case VOTE_SYSTEM_SUCCESS:
            return {
                ...state,
                voteSystem: payload,
                loading: false,
            };
        case VOTE_SYSTEM_ERROR:
            return {
                ...state,
                loading: false,
            };
        case VOTE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case VOTE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case VOTE_ERROR:
            return {
                ...state,
                loading: false,
            };
        case DELETE_VOTE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case DELETE_VOTE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case DELETE_VOTE_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}

// Actions Creators
export const getVoteSystem = payload => {
    return {
        type: VOTE_SYSTEM_REQUEST,
        payload,
    };
}

export const setVotePoints = payload => {
    return {
        type: VOTE_REQUEST,
        payload,
    };
}

export const deleteVotePoints = payload => {
    return {
        type: DELETE_VOTE_REQUEST,
        payload,
    };
}

// Selectors
const stateSelector = state => state.vote;
export const voteSystemSelector = createSelector(stateSelector, state => state.voteSystem);
export const progressSelector = createSelector(stateSelector,state => state.loading);

// Saga
function* voteSystemSaga({payload}) {
    try {
        const result = yield postman.post('/vote/voteSystem', payload);
        yield put({
            type: VOTE_SYSTEM_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: VOTE_SYSTEM_ERROR,
            payload: response.data,
        });
    }
}

function* voteSaga({payload}) {
    try {
        const {id, points, callback} = payload;
        const result = yield postman.post(`/vote/${id}`, {points});
        yield put({
            type: VOTE_SUCCESS,
            payload: result
        });
        callback && callback();
    } catch ({response}) {
        yield put({
            type: VOTE_ERROR,
            payload: response.data,
        });
    }
}

function* deleteVoteSaga({payload}) {
    try {
        const {id, userId, callback} = payload;
        const result = yield postman.delete(`/vote/${id}/${userId}`);
        yield put({
            type: DELETE_VOTE_SUCCESS,
            payload: result
        });
        callback && callback();
    } catch ({response}) {
        yield put({
            type: DELETE_VOTE_SUCCESS,
            payload: response.data,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(VOTE_SYSTEM_REQUEST, voteSystemSaga),
        takeEvery(VOTE_REQUEST, voteSaga),
        takeEvery(DELETE_VOTE_REQUEST, deleteVoteSaga),
    ]);
}