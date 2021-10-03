import api from "../../api/api"
import { ErrorResponse } from "../../models/error"
import { ProductDetailResponse } from "../../models/product"
import { AppDispatch } from "../store"

export const FETCHING_EDIT_PRODUCT = "FETCHING_EDIT_PRODUCT"
export const EDIT_PRODUCT_SUCCESS = "EDIT_PRODUCT_SUCCESS"
export const EDIT_PRODUCT_FAILURE = "EDIT_PRODUCT_FAILURE"
export const EDIT_PRODUCT_RESET = "EDIT_PRODUCT_RESET"

const isFetchingEditProduct = () => {
    return { type: FETCHING_EDIT_PRODUCT }
}

const editProductSuccess = (product: ProductDetailResponse) => {
    return { type: EDIT_PRODUCT_SUCCESS, payload: product }
}

const editProductFailure = (err: ErrorResponse) => {
    return { type: EDIT_PRODUCT_FAILURE, payload: err }
}

export const editProductReset = () => {
    return { type: EDIT_PRODUCT_RESET }
}

export const editProductActions = async (dispatch: AppDispatch, token: string, formData: FormData, isEdit: boolean, id? : string) => {
    dispatch(isFetchingEditProduct())
    let url = "/products/create"
    if (isEdit === true && id) {
        url = `/products/edit/${id}`
    }
    try {
        const data = await api.createFormDataRequest<ProductDetailResponse>(url, formData, token)
        if (data) {
            dispatch(editProductSuccess(data))
        }
        else {
            dispatch(editProductFailure({
                message: "Something went wrong",
                code: 500
            }))
        }
    } catch (err) {
        let error: ErrorResponse = err as ErrorResponse
        dispatch(editProductFailure(error))
    }

}