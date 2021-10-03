import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Login from '../screens/Login';
import Register from '../screens/Register';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export type AuthStackParamList = {
    Login: undefined,
    Register: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
                color: Colors.primary
            }
        }}>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={({ navigation }) => ({
                    title: "Register",
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

export default AuthStack