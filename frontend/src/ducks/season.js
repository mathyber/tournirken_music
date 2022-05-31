import {all, put, takeEvery} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {postman} from "../utils/postman";
import {type} from "@testing-library/user-event/dist/type";

// Types
const GET_SEASONS_REQUEST = 'GET_SEASONS_REQUEST';
const GET_SEASONS_SUCCESS = 'GET_SEASONS_SUCCESS';
const GET_SEASONS_ERROR = 'GET_SEASONS_ERROR';

const CREATE_SEASON_REQUEST = 'CREATE_SEASON_REQUEST';
const CREATE_SEASON_SUCCESS = 'CREATE_SEASON_SUCCESS';
const CREATE_SEASON_ERROR = 'CREATE_SEASON_ERROR';

const GET_SEASON_REQUEST = 'GET_SEASON_REQUEST';
const GET_SEASON_SUCCESS = 'GET_SEASON_SUCCESS';
const GET_SEASON_ERROR = 'GET_SEASON_ERROR';

// Initial State
const initial = {
    seasonsData: {},
    loading: false
};

// Reducer
export default (state = initial, {type, payload}) => {
    switch (type) {
        case GET_SEASONS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_SEASONS_SUCCESS:
            return {
                ...state,
                seasonsData: payload,
                loading: false,
            };
        case GET_SEASONS_ERROR:
            return {
                ...state,
                loading: false,
            };
        case CREATE_SEASON_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CREATE_SEASON_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case CREATE_SEASON_ERROR:
            return {
                ...state,
                loading: false,
            };
        case GET_SEASON_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_SEASON_SUCCESS:
            return {
                ...state,
                loading: false,
                season: payload
            };
        case GET_SEASON_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}

// Actions Creators
export const getSeasons = payload => {
    return {
        type: GET_SEASONS_REQUEST,
        payload,
    };
}

export const getSeason = payload => {
    return {
        type: GET_SEASON_REQUEST,
        payload,
    };
}

export const saveSeason = payload => {
    return {
        type: CREATE_SEASON_REQUEST,
        payload,
    };
}

// Selectors
const stateSelector = state => state.season;
export const seasonsSelector = createSelector(stateSelector, state => state.seasonsData);
export const progressSelector = createSelector(stateSelector,state => state.loading);
export const seasonSelector = createSelector(stateSelector,state => {
    let stages = state.season?.stages || [];

    let final = stages.find(s => !s.nextStage);
    let others = stages.filter(s => s.nextStage);
    let sfWithSc = others.find(s => s.secondChanceStage);
    let secondChance = (others?.length > 1 && sfWithSc) && others.find(s => s.id === sfWithSc.secondChanceStage);
    let semifinals = secondChance ? others.filter(s => s.id !== secondChance.id) : others;

    return {
        ...state.season,
        final,
        secondChance,
        semifinals
    }
});

// Saga
function* getSeasonsSaga({payload}) {
    try {
        const result = yield postman.post('/season/seasons', payload);
        yield put({
            type: GET_SEASONS_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: GET_SEASONS_ERROR,
            payload: response.data,
        });
    }
}

function* getSeasonSaga({payload}) {
    try {
        const result = yield postman.get('/season/season/'+payload);
        yield put({
            type: GET_SEASON_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: GET_SEASON_ERROR,
            payload: response.data,
        });
    }
}

function* saveSeasonSaga({payload}) {
    try {
        const result = yield postman.post('/season/createOrEdit', payload);
        if (result?.season?.id){
            yield put(getSeason(result?.season?.id))
        }
        yield put({
            type: CREATE_SEASON_SUCCESS,
            payload: result
        });
    } catch ({response}) {
        yield put({
            type: CREATE_SEASON_ERROR,
            payload: response.data,
        });
    }
}

export function* saga() {
    yield all([
        takeEvery(GET_SEASONS_REQUEST, getSeasonsSaga),
        takeEvery(GET_SEASON_REQUEST, getSeasonSaga),
        takeEvery(CREATE_SEASON_REQUEST, saveSeasonSaga),
    ]);
}