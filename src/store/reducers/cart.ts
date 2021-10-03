import { AnyAction } from "redux";
import { CartResponse } from "../../models/cart";
import { ErrorResponse } from "../../models/error";
import { FETCHING_CARTS, FETCH_CARTS_FAILURE, FETCH_CARTS_SUCCESS } from "../actions/cart";

export type FetchCartsState = {
    isFetchingCarts: boolean,
    carts: CartResponse | null,
    errorFetchCarts: ErrorResponse | null
}

const initialState: FetchCartsState = {
    isFetchingCarts: false,
    carts: null,
    errorFetchCarts: null
}

export const fetchCartsReducer = (state: FetchCartsState = initialState, action: AnyAction) => {
    switch (action.type) {
        case FETCHING_CARTS:
            return {
                ...state,
                isFetchingCarts: true,
            }

        case FETCH_CARTS_SUCCESS:
            return {
                ...state,
                isFetchingCarts: false,
                carts: action.payload,
                errorFetchCarts: null
            }

        case FETCH_CARTS_FAILURE:
            return {
                ...state,
                isFetchingCarts: false,
                carts: null,
                errorFetchCarts: action.payload
            }

        default:
            return state;
    }
}