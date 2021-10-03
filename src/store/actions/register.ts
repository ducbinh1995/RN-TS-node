import api from "../../api/api"
import { ErrorResponse } from "../../models/error"
import { AppDispatch } from "../store"

export const FETCHING_REGISTER = "FETCHING_REGISTER"
export const REGISTER_SUCCESS = "REGISTER_SUCCESS"
export const REGISTER_FAILURE = "REGISTER_FAILURE"
export const REGISTER_RESET = "REGISTER_RESET"

const isFetchingRegister = () => {
    return { type: FETCHING_REGISTER }
}

const registerSuccess = () => {
    return { type: REGISTER_SUCCESS }
}

const registerFailure = (err: ErrorResponse) => {
    return { type: REGISTER_FAILURE, payload: err }
}

export const registerReset = () => {
    return { type: REGISTER_RESET }
}

export const registerActions = async (dispatch: AppDispatch, email: string, password: string, confirmpassword: string) => {
    dispatch(isFetchingRegister())
    try {
        const data = await api.createRequest<any>("/auth/signup", { email, password, confirmpassword }, "POST")
        if (data) {
            dispatch(registerSuccess())
        }
        else {
            dispatch(registerFailure({
                message: "Something went wrong",
                code: 500
            }))
        }
    } catch (err) {
        let error: ErrorResponse = err as ErrorResponse
        dispatch(registerFailure(error))
    }

}