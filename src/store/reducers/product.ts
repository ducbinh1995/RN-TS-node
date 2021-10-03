import { AnyAction } from "redux";
import { ErrorResponse } from "../../models/error";
import { ProductResponse } from "../../models/product";
import { FETCHING_PRODUCT, FETCH_PRODUCT_FAILURE, FETCH_PRODUCT_SUCCESS } from "../actions/product";

export type FetchProductState = {
    isFetchingProduct: boolean,
    products: ProductResponse | null,
    errorFetchProduct: ErrorResponse | null
}

const initialState: FetchProductState = {
    isFetchingProduct: false,
    products: null,
    errorFetchProduct: null
}

export const fetchProductReducer = (state: FetchProductState = initialState, action: AnyAction) => {
    switch (action.type) {
        case FETCHING_PRODUCT:
            return {
                ...state,
                isFetchingProduct: true,
            }

        case FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                isFetchingProduct: false,
                products: action.payload,
                errorFetchProduct: null
            }

        case FETCH_PRODUCT_FAILURE:
            return {
                ...state,
                isFetchingProduct: false,
                products: null,
                errorFetchProduct: action.payload
            }

        default:
            return state;
    }
}