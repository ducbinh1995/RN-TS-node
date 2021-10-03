import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState, useEffect } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DefaultButton from '../components/DefaultButton';
import DefaultText from '../components/DefaultText';
import Loading from '../components/Loading';
import ProductItem from '../components/ProductItem';
import Colors from '../constants/Colors';
import { Product, ProductDetailResponse } from '../models/product';
import { MainStackParamList } from '../routes/MainStack';
import { ProductStackParamList } from '../routes/ProductsStack';
import { fetchProductActions } from '../store/actions/product';
import { AuthState } from '../store/reducers/auth';
import { FetchProductState } from '../store/reducers/product';
import { AppDispatch, RootState } from '../store/store';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorResponse } from '../models/error';
import api from '../api/api';
import { showAlert, showAlertError } from '../util/showAlert';

type MainProps = NativeStackScreenProps<MainStackParamList, 'MainDrawer'>
type AdminProps = NativeStackScreenProps<MainStackParamList, 'AdminDrawer'>
type ProductProps = NativeStackScreenProps<ProductStackParamList, 'Products'>

const Products = (props: ProductProps) => {
    const [products, setProducts] = useState<Product[]>([])
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch<AppDispatch>()
    const authState = useSelector<RootState, AuthState>(state => state.authReducer)
    const fetchProductState = useSelector<RootState, FetchProductState>(state => state.fetchProductReducer)

    const mainNavigation = useNavigation<MainProps["navigation"]>()
    const adminNavigation = useNavigation<AdminProps["navigation"]>()
    const productNavigation = useNavigation<ProductProps["navigation"]>()

    const token = authState.user?.token
    const role = authState.user?.role
    const userId = authState.user?.userId

    const fetchProducts = useCallback(
        (page: number) => {
            if (token && userId) {
                fetchProductActions(dispatch, token, page, userId)
            }
        },
        [token, currentPage]
    )

    const reloadData = useCallback(
        () => {
            if (props.route.params !== undefined && props.route.params !== null) {
                const needReloadData = props.route.params.needReloadData
                const editProduct = props.route.params.editProduct
                if (needReloadData === true) {
                    if (currentPage == 1) {
                        fetchProducts(1)
                    }
                    else {
                        setCurrentPage(1)
                    }
                    productNavigation.setParams({ needReloadData: undefined })
                }
                if (editProduct !== undefined) {
                    setProducts(products.map(product => {
                        if (product._id === editProduct._id) {
                            return {
                                ...editProduct
                            }
                        }
                        else {
                            return product
                        }
                    }))
                    productNavigation.setParams({ editProduct: undefined })
                }
            }

        },
        [props.route.params],
    )

    useFocusEffect(
        reloadData
    )

    useEffect(() => {
        if (role === 'admin') {
            productNavigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity style={styles.rightButton} onPress={() => productNavigation.navigate('EditProduct', { id: undefined })}>
                        <Ionicons name="md-create" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                )
            })
        } else {
            productNavigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity style={styles.rightButton} onPress={() => productNavigation.navigate('Cart')}>
                        <Ionicons name="md-cart" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                )
            })
        }
    }, [])

    const showAlertTokenExpired = () => {
        showAlertError('Token is expired', [
            {
                text: 'OK',
                onPress: () => {
                    if (role === 'admin') {
                        adminNavigation.replace('AuthStack')
                    }
                    else if (role === 'user') {
                        mainNavigation.replace('AuthStack')
                    }
                }
            }
        ])
    }

    useEffect(() => {
        if (fetchProductState.errorFetchProduct !== null) {
            if (fetchProductState.errorFetchProduct.code === 401) {
                showAlertTokenExpired()
            }
            else {
                showAlertError(fetchProductState.errorFetchProduct.message)
            }
        }
    }, [fetchProductState.errorFetchProduct])

    useEffect(() => {
        const productsResponse = fetchProductState.products
        if (productsResponse) {
            setRefreshing(false)
            setProducts(productsResponse.products)
        }
    }, [fetchProductState.products])

    const onProductLeftHandler = (id: string) => {
        if (role === 'user') {
            productNavigation.navigate("ProductDetail", { id: id })
        }
        else {
            productNavigation.navigate("EditProduct", { id: id })
        }
    }

    const availableProduct = async (product: Product) => {
        setLoading(true)
        try {
            const data = await api.createRequest<ProductDetailResponse>(`/products/isAvailable/${product!._id}`, { isAvailable: product!.isAvailable, userId: userId }, "POST", token)
            setLoading(false)
            if (data) {
                const productResponse = data.product
                if (productResponse) {
                    setProducts(products.map(product => {
                        if (product._id !== productResponse._id) {
                            return product
                        }
                        else {
                            return {
                                ...product,
                                isAvailable: !product.isAvailable
                            }
                        }
                    }))
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

    const addToCart = async (product: Product) => {
        setLoading(true)
        try {
            const data = await api.createRequest<{ success: boolean }>('/carts/add', { productId: product!._id, userId: userId }, "POST", token)
            setLoading(false)
            if (data) {
                if (data.success === true) {
                    showAlert("", "Add To Cart Success",
                        [
                            {
                                text: 'View Cart',
                                onPress: () => {
                                    productNavigation.navigate("Cart")
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

    const onProductRightHandler = (product: Product) => {
        if (role === "admin") {
            availableProduct(product)
        }
        else {
            addToCart(product)
        }
    }

    const onRefresh = useCallback(
        async () => {
            setRefreshing(true)
            if (currentPage !== 1) {
                setCurrentPage(1)
            }
            else {
                fetchProducts(1)
            }
        },
        [],
    )

    useEffect(() => {
        fetchProducts(currentPage)
    }, [currentPage])

    const onLoadmore = () => {
        if (hasNextPage) {
            setCurrentPage(currentPage + 1)
        }
    }

    const renderProducts = () => {
        const productResponse = fetchProductState.products
        if (productResponse) {
            if (products.length === 0) {
                return (
                    <ScrollView
                        contentContainerStyle={styles.container}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }>
                        <DefaultText style={styles.notFoundText}>
                            No products found
                        </DefaultText>
                    </ScrollView>
                )
            }
            else {
                return (
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        keyExtractor={(item) => item._id}
                        data={products}
                        renderItem={({ item }) => (
                            <ProductItem
                                product={item}
                                onSelect={() => onProductLeftHandler(item._id)}
                            >
                                <DefaultButton
                                    style={styles.button}
                                    onPress={() => onProductLeftHandler(item._id)}
                                >
                                    <DefaultText style={styles.buttonTitle}>
                                        {role === 'admin' ? 'Edit' : 'Details'}
                                    </DefaultText>
                                </DefaultButton>
                                <DefaultButton
                                    style={styles.button}
                                    onPress={() => onProductRightHandler(item)}
                                >
                                    <DefaultText style={styles.buttonTitle}>
                                        {role === 'admin' ? item.isAvailable ? 'Delete' : 'Restock' : 'Add To Cart'}
                                    </DefaultText>
                                </DefaultButton>
                            </ProductItem>
                        )}
                        onEndReached={onLoadmore}
                        onEndReachedThreshold={0}
                    />
                )
            }
        }
        return <View></View>

    }

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            {renderProducts()}
            {!refreshing && fetchProductState.isFetchingProduct && <Loading />}
            {loading && <Loading />}
        </SafeAreaView>
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
    button: {
        height: 40,
        width: 120,
        borderRadius: 20,
        alignSelf: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16
    },
    rightButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default Products;