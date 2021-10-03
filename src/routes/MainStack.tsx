import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import Splash from '../screens/Splash';
import AdminDrawer from './AdminDrawer';
import AuthStack from './AuthStack';
import MainDrawer from './MainDrawer';

export type MainStackParamList = {
    Splash: undefined,
    AuthStack: undefined,
    MainDrawer: undefined,
    AdminDrawer: undefined
}

const Stack = createNativeStackNavigator<MainStackParamList>()

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen
                name="Splash"
                component={Splash}
            />
            <Stack.Screen
                name="AuthStack"
                component={AuthStack}
                options={{
                    animationTypeForReplace: "push"
                }}
            />
            <Stack.Screen
                name="MainDrawer"
                component={MainDrawer}
                options={{
                    animationTypeForReplace: "push"
                }}
            />
            <Stack.Screen
                name="AdminDrawer"
                component={AdminDrawer}
                options={{
                    animationTypeForReplace: "push"
                }}
            />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
})

export default MainStack