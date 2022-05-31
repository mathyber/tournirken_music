import { all } from 'redux-saga/effects';
import { saga as userSaga } from '../ducks/user';
import { saga as contestSaga } from '../ducks/contest';
import { saga as seasonSaga } from '../ducks/season';

export default function* rootSaga() {
    yield all([
        userSaga(),
        contestSaga(),
        seasonSaga()
    ]);
}
