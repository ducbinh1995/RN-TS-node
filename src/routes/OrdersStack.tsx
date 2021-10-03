import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Orders from '../screens/Orders';

export type OrderStackParamList = {
    Orders: undefined,
}

const Stack = createNativeStackNavigator<OrderStackParamList>()

const OrdersStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerTitleAlign: 'center'
        }}>
            <Stack.Screen
                name="Orders"
                component={Orders}
                options={({ navigation }) => ({
                    title: "Your Orders",
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.toggleDrawer()}>
                            <Ionicons name="ios-menu" size={24} color={Colors.primary} />
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

export default OrdersStack