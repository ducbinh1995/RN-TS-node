import { AnyAction } from "redux";
import { ErrorResponse } from "../../models/error";
import { OrderResponse } from "../../models/order";
import { FETCHING_ORDERS, FETCH_ORDERS_FAILURE, FETCH_ORDERS_SUCCESS } from "../actions/order";

export type FetchOrdersState = {
    isFetchingOrders: boolean,
    orders: OrderResponse | null,
    errorFetchOrders: ErrorResponse | null
}

const initialState: FetchOrdersState = {
    isFetchingOrders: false,
    orders: null,
    errorFetchOrders: null
}

export const fetchOrdersReducer = (state: FetchOrdersState = initialState, action: AnyAction) => {
    switch (action.type) {
        case FETCHING_ORDERS:
            return {
                ...state,
                isFetchingOrders: true,
            }

        case FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                isFetchingOrders: false,
                orders: action.payload,
                errorFetchOrders: null
            }

        case FETCH_ORDERS_FAILURE:
            return {
                ...state,
                isFetchingOrders: false,
                orders: null,
                errorFetchOrders: action.payload
            }

        default:
            return state;
    }
}