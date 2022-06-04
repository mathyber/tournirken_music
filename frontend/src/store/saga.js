import { all } from 'redux-saga/effects';
import { saga as userSaga } from '../ducks/user';
import { saga as contestSaga } from '../ducks/contest';
import { saga as seasonSaga } from '../ducks/season';
import { saga as appSaga } from '../ducks/application';
import { saga as voteSaga } from '../ducks/vote';
import { saga as resultSaga } from '../ducks/result';

export default function* rootSaga() {
    yield all([
        userSaga(),
        contestSaga(),
        seasonSaga(),
        appSaga(),
        voteSaga(),
        resultSaga(),
    ]);
}
