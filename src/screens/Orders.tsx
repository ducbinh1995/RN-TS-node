import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DefaultText from '../components/DefaultText'
import Loading from '../components/Loading'
import OrderItem from '../components/OrderItem'
import { MainStackParamList } from '../routes/MainStack'
import { fetchOrdersActions } from '../store/actions/order'
import { AuthState } from '../store/reducers/auth'
import { FetchOrdersState } from '../store/reducers/order'
import { AppDispatch, RootState } from '../store/store'
import { showAlertError } from '../util/showAlert'

type MainProps = NativeStackScreenProps<MainStackParamList, 'MainDrawer'>

const Orders = () => {

    const dispatch = useDispatch<AppDispatch>()
    const authState = useSelector<RootState, AuthState>(state => state.authReducer)
    const fetchOrderState = useSelector<RootState, FetchOrdersState>(state => state.fetchOrdersReducer)

    const mainNavigation = useNavigation<MainProps["navigation"]>()

    const token = authState.user?.token
    const userId = authState.user?.userId

    const fetchOrders = useCallback(
        () => {
            if (token && userId) {
                fetchOrdersActions(dispatch, token, userId)
            }
        },
        [],
    )

    useFocusEffect(
        fetchOrders
    )

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
        if (fetchOrderState.errorFetchOrders !== null) {
            if (fetchOrderState.errorFetchOrders.code === 401) {
                showAlertTokenExpired()
            }
            else {
                showAlertError(fetchOrderState.errorFetchOrders.message)
            }
        }
    }, [fetchOrderState.errorFetchOrders])

    const renderOrders = () => {
        const ordersResponse = fetchOrderState.orders
        if (ordersResponse !== null) {
            const orders = ordersResponse.orders
            if (orders.length === 0) {
                return (
                    <DefaultText style={styles.notFoundText}>
                        No orders found
                    </DefaultText>
                )
            }
            else {
                return (
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={orders}
                        renderItem={({ item }) => (
                            <OrderItem
                                total={item.total}
                                date={item.date}
                                products={item.products}
                            />
                        )}
                    />
                )
            }
        }
        return <View></View>
    }

    return (
        <View style={styles.container}>
            {renderOrders()}
            {fetchOrderState.isFetchingOrders && <Loading />}
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
})

export default Orders