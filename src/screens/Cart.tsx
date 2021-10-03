import { CompositeScreenProps, useNavigation } from '@react-navigation/core'
import { DrawerScreenProps } from '@react-navigation/drawer'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useCallback, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/api'
import Card from '../components/Card'
import CartItem from '../components/CartItem'
import DefaultButton from '../components/DefaultButton'
import DefaultText from '../components/DefaultText'
import Loading from '../components/Loading'
import Colors from '../constants/Colors'
import { ErrorResponse } from '../models/error'
import { Product } from '../models/product'
import { MainDrawerParamList } from '../routes/MainDrawer'
import { MainStackParamList } from '../routes/MainStack'
import { ProductStackParamList } from '../routes/ProductsStack'
import { fetchCartsActions } from '../store/actions/cart'
import { AuthState } from '../store/reducers/auth'
import { FetchCartsState } from '../store/reducers/cart'
import { AppDispatch, RootState } from '../store/store'
import { showAlert, showAlertError } from '../util/showAlert'

type MainProps = NativeStackScreenProps<MainStackParamList, 'MainDrawer'>
type CartScreenNavigationProps = CompositeScreenProps<
    NativeStackScreenProps<ProductStackParamList, "Cart">,
    DrawerScreenProps<MainDrawerParamList, "ProductsStack">
>

const Cart = () => {

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch<AppDispatch>()
    const authState = useSelector<RootState, AuthState>(state => state.authReducer)
    const fetchCartsState = useSelector<RootState, FetchCartsState>(state => state.fetchCartsReducer)

    const mainNavigation = useNavigation<MainProps["navigation"]>()
    const drawerNavigation = useNavigation<CartScreenNavigationProps["navigation"]>()

    const token = authState.user?.token
    const userId = authState.user?.userId

    const fetchCarts = useCallback(
        () => {
            if (token && userId) {
                fetchCartsActions(dispatch, token, userId)
            }
        },
        [],
    )

    useEffect(() => {
        fetchCarts()
    }, [])

    const showAlertTokenExpired = () => {
        showAlertError('Token is expired', [
            {
                text: 'OK',
                onPress: () => {
                    mainNavigation.replace('AuthStack')
                }
            }
        ])
    }

    useEffect(() => {
        if (fetchCartsState.errorFetchCarts !== null) {
            if (fetchCartsState.errorFetchCarts.code === 401) {
                showAlertTokenExpired()
            }
            else {
                showAlertError(fetchCartsState.errorFetchCarts.message)
            }
        }
    }, [fetchCartsState.errorFetchCarts])

    const onRemoveItem = async (product: Product) => {
        setLoading(true)
        try {
            const data = await api.createRequest<{ success: boolean }>('/carts/delete', { productId: product._id, userId: userId }, "POST", token)
            setLoading(false)
            if (data) {
                if (data.success === true) {
                    showAlert("", "Delete Success")
                    fetchCarts()
                }
                else {
                    showAlertError("Delete Failed")
                }
            }
            else {
                showAlertError("Something went wrong")
            }
        } catch (err) {
            setLoading(false)
            let error: ErrorResponse = err as ErrorResponse
            if (error.code === 401) {
                showAlertTokenExpired()
            }
            else {
                showAlertError(error.message)
            }
        }
    }

    const orderCart = async () => {
        setLoading(true)
        try {
            const data = await api.createRequest<{ success: boolean }>('/orders/add', { userId }, "POST", token)
            setLoading(false)
            if (data) {
                fetchCarts()
                if (data.success === true) {
                    showAlert("", "Add To Order Success",
                        [
                            {
                                text: 'View Order',
                                onPress: () => {
                                    drawerNavigation.navigate('OrdersStack')
                                    // productNavigation.navigate("Cart")
                                }
                            },
                            {
                                text: 'Cancel',
                                style: "cancel",
                                onPress: () => {

                                }
                            }
                        ]
                    )
                }
                else {
                    showAlertError("Add To Cart Failed")
                }
            }
            else {
                showAlertError("Something went wrong")
            }
        } catch (err) {
            setLoading(false)
            let error: ErrorResponse = err as ErrorResponse
            if (error.code === 401) {
                showAlertTokenExpired()
            }
            else {
                showAlertError(error.message)
            }
        }
    }

    const renderCarts = () => {
        const cartsResponse = fetchCartsState.carts
        if (cartsResponse !== null) {
            const carts = cartsResponse.carts
            if (carts.length === 0) {
                return (
                    <>
                        <Card style={styles.summary}>
                            <DefaultText style={styles.summaryText}>
                                Total:{' '}
                                <DefaultText style={styles.amount}>
                                    $0
                                </DefaultText>
                            </DefaultText>
                            <DefaultButton
                                style={styles.orderButton}
                                disabled={true}
                                onPress={() => { }}
                            >
                                <DefaultText style={styles.buttonTitle}>
                                    Order Now
                                </DefaultText>
                            </DefaultButton>
                        </Card>
                        <DefaultText style={styles.notFoundText}>
                            No products found
                        </DefaultText>
                    </>
                )
            }
            else {
                let total: number = 0
                carts.forEach(cart => {
                    total += cart.product.price * cart.quantity
                });
                return (
                    <>
                        <Card style={styles.summary}>
                            <DefaultText style={styles.summaryText}>
                                Total:{' '}
                                <DefaultText style={styles.amount}>
                                    ${Math.round(parseFloat(total.toFixed(2)) * 100) / 100}
                                </DefaultText>
                            </DefaultText>
                            <DefaultButton
                                style={styles.orderButton}
                                disabled={carts.length === 0}
                                onPress={orderCart}
                            >
                                <DefaultText style={styles.buttonTitle}>
                                    Order Now
                                </DefaultText>
                            </DefaultButton>
                        </Card>
                        <FlatList
                            keyExtractor={(item) => item.product._id}
                            data={carts}
                            renderItem={({ item }) => (
                                <CartItem
                                    quantity={item.quantity}
                                    title={item.product.title}
                                    amount={item.product.price * item.quantity}
                                    onRemove={() => onRemoveItem(item.product)}
                                />
                            )}
                        />
                    </>
                )
            }
        }
        return <View></View>
    }

    return (
        <View style={styles.container}>
            {renderCarts()}
            {fetchCartsState.isFetchingCarts && <Loading />}
            {loading && <Loading />}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    notFoundText: {
        marginTop: 30,
        alignSelf: 'center'
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        marginTop: 20,
        marginHorizontal: 20
    },
    summaryText: {
        // fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    },
    orderButton: {
        color: Colors.accent,
        height: 40,
        width: 120,
        borderRadius: 20,
        alignSelf: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16
    },
})

export default Cart;