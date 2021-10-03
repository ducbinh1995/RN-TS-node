import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Products from '../screens/Products';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import ProductDetail from '../screens/ProductDetail';
import EditProduct from '../screens/EditProduct';
import { Product } from '../models/product';
import Cart from '../screens/Cart';

export type ProductStackParamList = {
    Products: { needReloadData?: boolean, editProduct?: Product },
    ProductDetail: { id: string },
    EditProduct: { id?: string },
    Cart: undefined
}

const Stack = createNativeStackNavigator()

const ProductsStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Products"
            screenOptions={{
                headerTitleAlign: 'center'
            }}>
            <Stack.Screen
                name="Products"
                component={Products}
                options={({ navigation }) => ({
                    title: "All Products",
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.toggleDrawer()}>
                            <Ionicons name="ios-menu" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    )
                })}
            />
            <Stack.Screen
                name="ProductDetail"
                component={ProductDetail}
                options={({ navigation }) => ({
                    title: "",
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    )
                })}
            />
            <Stack.Screen
                name="EditProduct"
                component={EditProduct}
                options={({ navigation }) => ({
                    title: "",
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    )
                })}
            />
            <Stack.Screen
                name="Cart"
                component={Cart}
                options={({ navigation }) => ({
                    title: "Your Cart",
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    )
                })}
            />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    backBtn: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default ProductsStack