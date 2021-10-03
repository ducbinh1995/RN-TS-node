import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerScreenProps } from '@react-navigation/drawer';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Colors from '../constants/Colors';
import { logout } from '../store/actions/auth';
import { AppDispatch } from '../store/store';
import { MainStackParamList } from './MainStack';
import OrdersStack from './OrdersStack';
import ProductsStack from './ProductsStack';

const Drawer = createDrawerNavigator()

type MainProps = NativeStackScreenProps<MainStackParamList, 'AdminDrawer'>
type MainStackProps = NativeStackNavigationProp<MainStackParamList, "AdminDrawer">

const onLogout = (navigation: MainStackProps, dispatch: Dispatch) => {
    Alert.alert('Do you want to logout?', undefined, [
        {
            text: 'OK',
            onPress: async () => {
                dispatch(logout())
                await AsyncStorage.removeItem("token")
                navigation.replace("AuthStack")
            }
        },
        {
            text: 'Cancel',
            onPress: () => {}
        }
    ])
    
}

const CustomDrawerContent: FC<{dispatch: Dispatch, stackNavigation: MainStackProps, props: DrawerContentComponentProps}> = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props.props} />
            <DrawerItem
                label="Logout"
                onPress={() => onLogout(props.stackNavigation, props.dispatch)}
            />
        </DrawerContentScrollView>
    )
}

const AdminDrawer = () => {
    const mainNavigation = useNavigation<MainProps["navigation"]>()
    const dispatch = useDispatch<AppDispatch>()

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: Colors.primary
            }}
            drawerContent={props => <CustomDrawerContent dispatch={dispatch} stackNavigation={mainNavigation} props={props} />}
        >
            <Drawer.Screen
                name="ProductsStack"
                component={ProductsStack}
                options={{
                    title: "Products"
                }}
            />
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({

})

export default AdminDrawer;