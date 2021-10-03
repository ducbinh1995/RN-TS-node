import { AnyAction } from "redux";
import { ErrorResponse } from "../../models/error";
import { ProductDetailResponse } from "../../models/product";
import { FETCHING_PRODUCT_DETAIL, FETCH_PRODUCT_DETAIL_FAILURE, FETCH_PRODUCT_DETAIL_SUCCESS } from "../actions/productDetail";

export type FetchProductDetailState = {
    isFetchingProductDetail: boolean,
    product: ProductDetailResponse | null,
    errorFetchProductDetail: ErrorResponse | null
}

const initialState: FetchProductDetailState = {
    isFetchingProductDetail: false,
    product: null,
    errorFetchProductDetail: null
}

export const fetchProductDetailReducer = (state: FetchProductDetailState = initialState, action: AnyAction) => {
    switch (action.type) {
        case FETCHING_PRODUCT_DETAIL:
            return {
                ...state,
                isFetchingProductDetail: true,
            }

        case FETCH_PRODUCT_DETAIL_SUCCESS:
            return {
                ...state,
                isFetchingProductDetail: false,
                product: action.payload,
                errorFetchProductDetail: null
            }

        case FETCH_PRODUCT_DETAIL_FAILURE:
            return {
                ...state,
                isFetchingProductDetail: false,
                product: null,
                errorFetchProductDetail: action.payload
            }

        default:
            return state;
    }
}