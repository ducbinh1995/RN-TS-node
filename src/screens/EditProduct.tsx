import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useCallback, useEffect } from 'react';
import { Alert, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import BoldText from '../components/BoldText';
import DefaultButton from '../components/DefaultButton';
import DefaultText from '../components/DefaultText';
import Loading from '../components/Loading';
import { Product } from '../models/product';
import { MainStackParamList } from '../routes/MainStack';
import { ProductStackParamList } from '../routes/ProductsStack';
import { fetchProductDetailActions } from '../store/actions/productDetail';
import { AuthState } from '../store/reducers/auth';
import { FetchProductDetailState } from '../store/reducers/productDetail';
import { AppDispatch, RootState } from '../store/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { EditProductState } from '../store/reducers/editProduct';
import { editProductActions, editProductReset } from '../store/actions/editProduct';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { loginReset } from '../store/actions/auth';
import { HOST_IMAGE } from '../api/api';

type AdminProps = NativeStackScreenProps<MainStackParamList, 'AdminDrawer'>
type ProductProps = NativeStackScreenProps<ProductStackParamList, 'EditProduct'>

const EditProduct = (props: ProductProps) => {

    const { id } = props.route.params

    const { showActionSheetWithOptions } = useActionSheet()

    const [product, setProduct] = useState<Product | null>(null)
    const [title, setTitle] = useState<string>("")
    const [price, setPrice] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [image, setImage] = useState("")
    const [editImage, setEditImage] = useState(false)

    const dispatch = useDispatch<AppDispatch>()
    const authState = useSelector<RootState, AuthState>(state => state.authReducer)
    const fetchProductDetailState = useSelector<RootState, FetchProductDetailState>(state => state.fetchProductDetailReducer)
    const editProductState = useSelector<RootState, EditProductState>(state => state.editProductReducer)

    const mainNavigation = useNavigation<AdminProps["navigation"]>()
    const productNavigation = useNavigation<ProductProps["navigation"]>()

    const token = authState.user?.token
    const userId = authState.user?.userId

    const fetchProductDetail = useCallback(
        () => {
            if (token && id && userId) {
                fetchProductDetailActions(dispatch, token, id, userId)
            }
        },
        [token, id],
    )

    useFocusEffect(
        fetchProductDetail
    )

    useEffect(() => {
        if (fetchProductDetailState.errorFetchProductDetail !== null) {
            if (fetchProductDetailState.errorFetchProductDetail.code === 401) {
                Alert.alert("Error", 'Token is expired', [
                    {
                        text: 'OK',
                        onPress: () => {
                            mainNavigation.replace('AuthStack')
                        }
                    }
                ])
            }
            else {
                Alert.alert("Error", fetchProductDetailState.errorFetchProductDetail.message)
            }
        }
    }, [fetchProductDetailState.errorFetchProductDetail])

    useEffect(() => {
        if (editProductState.errorFetchEditProduct !== null) {
            dispatch(editProductReset())
            if (editProductState.errorFetchEditProduct.code === 401) {
                Alert.alert("Error", 'Token is expired', [
                    {
                        text: 'OK',
                        onPress: () => {
                            mainNavigation.replace('AuthStack')
                        }
                    }
                ])
            }
            else {
                Alert.alert("Error", editProductState.errorFetchEditProduct.message)
            }
        }
    }, [editProductState.errorFetchEditProduct])

    useEffect(() => {
        const productResponse = fetchProductDetailState.product
        if (productResponse !== null && productResponse !== undefined && id !== undefined) {
            productNavigation.setOptions({
                title: productResponse.product.title
            })
            setProduct(productResponse.product)
            setTitle(productResponse.product.title)
            setPrice(productResponse.product.price.toString())
            setContent(productResponse.product.content)
            setImage(HOST_IMAGE + productResponse.product.image)
        }
        else {
            productNavigation.setOptions({
                title: "Add Product"
            })
        }
    }, [fetchProductDetailState.product])

    useEffect(() => {
        const productResponse = editProductState.product
        const product = productResponse?.product
        if (productResponse !== null && productResponse !== undefined && product !== null && product !== undefined) {
            dispatch(editProductReset())
            let message = "Add Product success"
            if (id !== null && id !== undefined) {
                message = "Edit Product success"
            }
            Alert.alert(message, undefined, [
                {
                    text: 'OK',
                    onPress: () => {
                        if (id !== null && id !== undefined) {
                            productNavigation.navigate('Products', { editProduct: product })
                        }
                        else {
                            productNavigation.navigate('Products', { needReloadData: true })
                        }
                    }
                }
            ])
        }
        else {
            // let message = "Add Product error"
            // if (id !== null && id !== undefined) {
            //     message = "Edit Product error"
            // }
            // Alert.alert("Error", message, [
            //     {
            //         text: 'OK',
            //         onPress: () => {

            //         }
            //     }
            // ])
        }
    }, [editProductState.product])

    const onChangePrice = (text: string) => {
        const split = text.split('.')
        if (split.length >= 3) {
            return
        }
        if (text.length === 1 && text === "0") {
            return
        }
        if (text.length === 0) {
            setPrice("")
        }
        else {
            const regex = /^[0-9]+(\\.[0-9]+)?/
            if (regex.test(text)) {
                setPrice(text)
            }
        }
    }

    const launchMediaLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
        else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
            });

            if (!result.cancelled) {
                setEditImage(true)
                setImage(result.uri);
            }
        }
    }

    const launchCameraLibrary = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
        else {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
            });

            if (!result.cancelled) {
                setEditImage(true)
                setImage(result.uri);
            }
        }
    }

    const showImagePicker = () => {
        const options = ['Open Library', 'Open Camera', 'Cancel']
        const cancelButtonIndex = 2

        showActionSheetWithOptions({
            options,
            cancelButtonIndex
        },
            buttonIndex => {
                if (buttonIndex === 0) {
                    launchMediaLibrary()
                }
                else if (buttonIndex === 1) {
                    launchCameraLibrary()
                }
            }
        )
    }

    const onEditProduct = () => {
        let fileType: string = ""
        if (image.length > 0 && editImage === true) {
            fileType = image.split('.')[1]
        }
        const imageData = {
            uri: image,
            name: title + '.' + fileType,
            type: `image/${fileType}`
        }
        let formData: FormData = new FormData()
        formData.append("title", title)
        formData.append("content", content)
        formData.append("price", price)
        formData.append("userId", userId!)
        if (image.length > 0) {
            if (id === null || id === undefined || editImage === true) {
                formData.append("image", imageData as any)
            }
        }

        if (id !== null && id !== undefined) {
            editProductActions(dispatch, token!, formData, true, id)
        }
        else {
            editProductActions(dispatch, token!, formData, false, undefined)
        }
    }

    const renderProductDetail = () => {
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.form}>
                <View style={styles.formControl}>
                    <BoldText style={styles.label}>
                        Title
                    </BoldText>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={text => setTitle(text)}
                    />
                </View>
                <View style={styles.formControl}>
                    <BoldText style={styles.label}>
                        Image
                    </BoldText>
                    <View style={styles.image}>
                        {image.length > 0 && <Image style={styles.image} source={{ uri: image }} />}
                        <TouchableOpacity style={styles.imageButton} onPress={showImagePicker}>
                            <MaterialCommunityIcons name="image-edit" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {/* <Text style={styles.label}>Image URL</Text>
                        <TextInput
                            style={styles.input}
                            value={imageUrl}
                            onChangeText={text => setImageUrl(text)}
                        /> */}
                </View>
                <View style={styles.formControl}>
                    <BoldText style={styles.label}>
                        Price
                    </BoldText>
                    <TextInput
                        keyboardType="numeric"
                        style={styles.input}
                        value={price}
                        onChangeText={text => onChangePrice(text)}
                    />
                </View>
                <View style={styles.formControl}>
                    <BoldText style={styles.label}>
                        Content
                    </BoldText>
                    <TextInput
                        style={styles.input}
                        value={content}
                        onChangeText={text => setContent(text)}
                    />
                </View>
                <View style={styles.actions}>
                    <DefaultButton
                        style={styles.button}
                        onPress={onEditProduct}
                    >
                        <DefaultText style={styles.buttonTitle}>
                            {id ? "Edit" : "Add"}
                        </DefaultText>
                    </DefaultButton>
                </View>
            </KeyboardAwareScrollView>
        )
    }

    return (
        // <KeyboardAwareScrollView contentContainerStyle={styles.container} extraHeight={100} extraScrollHeight={100}>
        <>
            {renderProductDetail()}
            {fetchProductDetailState.isFetchingProductDetail && <Loading />}
            {editProductState.isFetchingEditProduct && <Loading />}
        </>
        // </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    form: {
        margin: 20
    },
    formControl: {
        width: '100%'
    },
    label: {
        // fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    image: {
        width: '100%',
        height: 300
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        fontFamily: 'open-sans',
        paddingHorizontal: 10
    },
    actions: {
        marginVertical: 30,
        alignItems: 'center'
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
    imageButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 16,
        right: 16
    }
})

export default EditProduct