import axios from 'axios';
import qs from 'qs';
import {toast} from 'react-toastify';
import store from '../store';
import {ACCESS_TOKEN, logout} from '../ducks/user';

export const postman = axios.create({
    baseURL: '/api',
    paramsSerializer: params => qs.stringify(params, {indices: false}),
});

export const downloader = axios.create({
    baseURL: '/api',
});

postman.interceptors.response.use(
    resp => {
        return resp.data;
    },
    error => {
        const {data = {}, status} = error.response;
        const {error: errorText = '', message = ''} = data;

        (errorText || message) && toast.error(errorText ? JSON.stringify(errorText) : message || 'Ошибка!');

        if (status === 401) {
            store.dispatch(logout());
        }

        return Promise.reject(error);
    },
);

export let setAccessToken = token => {
    if (token !== null) {
        postman.defaults.headers.common.Authorization = `Bearer ${token}`;
        downloader.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete postman.defaults.headers.common.Authorization;
        delete downloader.defaults.headers.common.Authorization;
    }
};

setAccessToken(localStorage.getItem(ACCESS_TOKEN));