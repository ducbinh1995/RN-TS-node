import api from "../../api/api"
import { ErrorResponse } from "../../models/error"
import { ProductDetailResponse } from "../../models/product"
import { AppDispatch } from "../store"

export const FETCHING_PRODUCT_DETAIL = "FETCHING_PRODUCT_DETAIL"
export const FETCH_PRODUCT_DETAIL_SUCCESS = "FETCH_PRODUCT_DETAIL_SUCCESS"
export const FETCH_PRODUCT_DETAIL_FAILURE = "FETCH_PRODUCT_DETAIL_FAILURE"

const isFetchingProductDetail = () => {
    return { type: FETCHING_PRODUCT_DETAIL }
}

const fetchProductDetailSuccess = (product: ProductDetailResponse) => {
    return { type: FETCH_PRODUCT_DETAIL_SUCCESS, payload: product }
}

const fetchProductDetailFailure = (err: ErrorResponse) => {
    return { type: FETCH_PRODUCT_DETAIL_FAILURE, payload: err }
}

export const fetchProductDetailActions = async (dispatch: AppDispatch, token: string, id: string, userId: string) => {
    dispatch(isFetchingProductDetail())
    try {
        const data = await api.createRequest<ProductDetailResponse>(`/products/${id}?userId=${userId}`, null, "GET", token)
        if (data) {
            dispatch(fetchProductDetailSuccess(data))
        }
        else {
            dispatch(fetchProductDetailFailure({
                message: "Something went wrong",
                code: 500
            }))
        }
    } catch (err) {
        let error: ErrorResponse = err as ErrorResponse
        dispatch(fetchProductDetailFailure(error))
    }

}