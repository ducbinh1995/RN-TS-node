import api from "../../api/api"
import { ErrorResponse } from "../../models/error"
import { ProductResponse } from "../../models/product"
import { AppDispatch } from "../store"

export const FETCHING_PRODUCT = "FETCHING_PRODUCT"
export const FETCH_PRODUCT_SUCCESS = "FETCH_PRODUCT_SUCCESS"
export const FETCH_PRODUCT_FAILURE = "FETCH_PRODUCT_FAILURE"

const isFetchingProduct = () => {
    return { type: FETCHING_PRODUCT }
}

const fetchProductSuccess = (product: ProductResponse) => {
    return { type: FETCH_PRODUCT_SUCCESS, payload: product }
}

const fetchProductFailure = (err: ErrorResponse) => {
    return { type: FETCH_PRODUCT_FAILURE, payload: err }
}

export const fetchProductActions = async (dispatch: AppDispatch, token: string, page: number, userId: string) => {
    dispatch(isFetchingProduct())
    try {
        const data = await api.createRequest<ProductResponse>(`/products?page=${page}&userId=${userId}`, null, "GET", token)
        if (data) {
            dispatch(fetchProductSuccess(data))
        }
        else {
            dispatch(fetchProductFailure({
                message: "Something went wrong",
                code: 500
            }))
        }
    } catch (err) {
        let error: ErrorResponse = err as ErrorResponse
        dispatch(fetchProductFailure(error))
    }

}