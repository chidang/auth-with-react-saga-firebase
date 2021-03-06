import { put } from 'redux-saga/effects';

import axios from '../../axios-orders';
import * as actions from '../actions/index';

export function* purchaseBurgerSaga(action) {
    yield put(actions.purchaseBurgerStart());
    const response = yield axios.post('/orders.json?auth=' + action.token, action.orderData);
    try {
        yield put(actions.purchaseBugerSuccess(response.data.name, action.orderData));
    } catch(error) {
        yield put(actions.purchaseBurgerFail(error));
    }
}

export function* fetchOrdersSaga(action) {
    yield put(actions.fetchOrderStart());
    const queryParams = '?auth=' + action.token  + '&orderBy="userId"&equalTo="' + action.userId + '"';
    const fetchedOrders = []
    try {
        const response = yield axios
        .get('/orders.json' + queryParams);
        for ( let key in response.data ) {
            fetchedOrders.push({
              ...response.data[key],
              id: key
            });
        }
        yield put(actions.fetchOrdersSuccess(fetchedOrders));
    } catch ( error ) {
        yield put(actions.fetchOrdersFail(error));
    }
}