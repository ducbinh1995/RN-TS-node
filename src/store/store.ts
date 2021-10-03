import { createStore, combineReducers, AnyAction, Reducer } from "redux";
import { authReducer } from "./reducers/auth";
import { registerReducer } from "./reducers/register";
import { fetchProductReducer } from "./reducers/product";
import { fetchProductDetailReducer } from "./reducers/productDetail";
import { editProductReducer } from "./reducers/editProduct";
import { fetchCartsReducer } from "./reducers/cart";
import { fetchOrdersReducer } from './reducers/order'
import { USER_LOGOUT } from "./actions/auth";

const appReducer = combineReducers({
    authReducer,
    registerReducer,
    fetchProductReducer,
    fetchProductDetailReducer,
    editProductReducer,
    fetchCartsReducer,
    fetchOrdersReducer
})

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    switch (action.type) {
        case USER_LOGOUT:
            return appReducer(undefined, action)
        default:
            return appReducer(state, action)
    }
};

const store = createStore(rootReducer)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store