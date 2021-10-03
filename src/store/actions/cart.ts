import api from "../../api/api"
import { CartResponse } from "../../models/cart"
import { ErrorResponse } from "../../models/error"
import { AppDispatch } from "../store"

export const FETCHING_CARTS = "FETCHING_CARTS"
export const FETCH_CARTS_SUCCESS = "FETCH_CARTS_SUCCESS"
export const FETCH_CARTS_FAILURE = "FETCH_CARTS_FAILURE"

const isFetchingCarts = () => {
    return { type: FETCHING_CARTS }
}

const fetchCartsSuccess = (carts: CartResponse) => {
    return { type: FETCH_CARTS_SUCCESS, payload: carts }
}

const fetchCartsFailure = (err: ErrorResponse) => {
    return { type: FETCH_CARTS_FAILURE, payload: err }
}

export const fetchCartsActions = async (dispatch: AppDispatch, token: string, userId: string) => {
    dispatch(isFetchingCarts())
    try {
        const data = await api.createRequest<CartResponse>(`/carts?userId=${userId}`, null, "GET", token)
        if (data) {
            dispatch(fetchCartsSuccess(data))
        }
        else {
            dispatch(fetchCartsFailure({
                message: "Something went wrong",
                code: 500
            }))
        }
    } catch (err) {
        let error: ErrorResponse = err as ErrorResponse
        dispatch(fetchCartsFailure(error))
    }

}