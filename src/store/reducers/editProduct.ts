import { AnyAction } from "redux";
import { ErrorResponse } from "../../models/error";
import { ProductDetailResponse } from "../../models/product";
import { EDIT_PRODUCT_FAILURE, EDIT_PRODUCT_RESET, EDIT_PRODUCT_SUCCESS, FETCHING_EDIT_PRODUCT } from "../actions/editProduct";

export type EditProductState = {
    isFetchingEditProduct: boolean,
    product: ProductDetailResponse | null,
    errorFetchEditProduct: ErrorResponse | null
}

const initialState: EditProductState = {
    isFetchingEditProduct: false,
    product: null,
    errorFetchEditProduct: null
}

export const editProductReducer = (state: EditProductState = initialState, action: AnyAction) => {
    switch (action.type) {
        case FETCHING_EDIT_PRODUCT:
            return {
                ...state,
                isFetchingEditProduct: true,
            }

        case EDIT_PRODUCT_SUCCESS:
            return {
                ...state,
                isFetchingEditProduct: false,
                product: action.payload,
                errorFetchEditProduct: null
            }

        case EDIT_PRODUCT_FAILURE:
            return {
                ...state,
                isFetchingEditProduct: false,
                product: null,
                errorFetchEditProduct: action.payload
            }

        case EDIT_PRODUCT_RESET: 
            return initialState

        default:
            return state;
    }
}