import { useFocusEffect, useNavigation } from '@react-navigation/core'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import api, { HOST_IMAGE } from '../api/api'
import BoldText from '../components/BoldText'
import DefaultButton from '../components/DefaultButton'
import DefaultText from '../components/DefaultText'
import Loading from '../components/Loading'
import { ErrorResponse } from '../models/error'
import { Product } from '../models/product'
import { MainStackParamList } from '../routes/MainStack'
import { ProductStackParamList } from '../routes/ProductsStack'
import { fetchProductDetailActions } from '../store/actions/productDetail'
import { AuthState } from '../store/reducers/auth'
import { FetchProductDetailState } from '../store/reducers/productDetail'
import { AppDispatch, RootState } from '../store/store'
import { showAlert, showAlertError } from '../util/showAlert'

type MainProps = NativeStackScreenProps<MainStackParamList, 'MainDrawer'>
type ProductProps = NativeStackScreenProps<ProductStackParamList, 'ProductDetail'>

const ProductDetail = (props: ProductProps) => {

    const { id } = props.route.params

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch<AppDispatch>()
    const authState = useSelector<RootState, AuthState>(state => state.authReducer)
    const fetchProductDetailState = useSelector<RootState, FetchProductDetailState>(state => state.fetchProductDetailReducer)

    const mainNavigation = useNavigation<MainProps["navigation"]>()
    const productNavigation = useNavigation<ProductProps["navigation"]>()

    const token = authState.user?.token
    const userId = authState.user?.userId

    const fetchProductDetail = useCallback(
        () => {
            if (token && userId) {
                fetchProductDetailActions(dispatch, token, id, userId)
            }
        },
        [token, id],
    )

    useFocusEffect(
        fetchProductDetail
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
        if (fetchProductDetailState.errorFetchProductDetail !== null) {
            if (fetchProductDetailState.errorFetchProductDetail.code === 401) {
                showAlertTokenExpired()
            }
            else {
                showAlertError(fetchProductDetailState.errorFetchProductDetail.message)
            }
        }
    }, [fetchProductDetailState.errorFetchProductDetail])

    useEffect(() => {
        const productResponse = fetchProductDetailState.product
        if (productResponse) {
            productNavigation.setOptions({
                title: productResponse.product.title
            })
            setProduct(productResponse.product)
        }
    }, [fetchProductDetailState.product])

    const addToCart = async () => {
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

    const renderProductDetail = () => {
        if (product === null) {
            return null
        }
        return (
            <>
                <Image style={styles.image} source={{ uri: HOST_IMAGE + product.image }} />
                <View style={styles.actions}>
                    <DefaultButton
                        style={styles.button}
                        onPress={addToCart}
                    >
                        <DefaultText style={styles.buttonTitle}>
                            Add To Cart
                        </DefaultText>
                    </DefaultButton>
                </View>
                <BoldText style={styles.price}>
                    ${product.price.toFixed(2)}
                </BoldText>
                <DefaultText style={styles.description}>
                    {product.content}
                </DefaultText>
            </>
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {renderProductDetail()}
            {fetchProductDetailState.isFetchingProductDetail && <Loading />}
            {loading && <Loading />}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    image: {
        width: '100%',
        height: 300
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center'
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
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
    }
})

export default ProductDetail