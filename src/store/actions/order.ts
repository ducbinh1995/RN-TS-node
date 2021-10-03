import api from "../../api/api"
import { ErrorResponse } from "../../models/error"
import { OrderResponse } from "../../models/order"
import { AppDispatch } from "../store"

export const FETCHING_ORDERS = "FETCHING_ORDERS"
export const FETCH_ORDERS_SUCCESS = "FETCH_ORDERS_SUCCESS"
export const FETCH_ORDERS_FAILURE = "FETCH_ORDERS_FAILURE"

const isFetchingOrders = () => {
    return { type: FETCHING_ORDERS }
}

const fetchOrdersSuccess = (carts: OrderResponse) => {
    return { type: FETCH_ORDERS_SUCCESS, payload: carts }
}

const fetchOrdersFailure = (err: ErrorResponse) => {
    return { type: FETCH_ORDERS_FAILURE, payload: err }
}

export const fetchOrdersActions = async (dispatch: AppDispatch, token: string, userId: string) => {
    dispatch(isFetchingOrders())
    try {
        const data = await api.createRequest<OrderResponse>(`/orders?userId=${userId}`, null, "GET", token)
        if (data) {
            dispatch(fetchOrdersSuccess(data))
        }
        else {
            dispatch(fetchOrdersFailure({
                message: "Something went wrong",
                code: 500
            }))
        }
    } catch (err) {
        let error: ErrorResponse = err as ErrorResponse
        dispatch(fetchOrdersFailure(error))
    }

}