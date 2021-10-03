import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/core'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, {useEffect, useCallback} from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import BoldText from '../components/BoldText'
import Colors from '../constants/Colors'
import { MainStackParamList } from '../routes/MainStack'
import { loginActions, loginReset } from '../store/actions/auth'
import { AuthState } from '../store/reducers/auth'
import { AppDispatch, RootState } from '../store/store'

type Props = NativeStackScreenProps<MainStackParamList, 'AuthStack'>

const Splash = () => {
    const navigation = useNavigation<Props["navigation"]>()

    const dispatch = useDispatch<AppDispatch>()
    const authState = useSelector<RootState, AuthState>(state => state.authReducer)

    const getData = useCallback(
        async () => {
            return await AsyncStorage.getItem("token")
        },
        [],
    )

    useEffect(() => {
        getData()
            .then(token => {
                if (token) {
                    loginActions(dispatch, undefined, undefined, token, true)
                }
                else {
                    navigation.reset({
                        index: 0,
                        routes: [{
                            name: "AuthStack"
                        }]
                    })
                }
            })
            .catch(err => {
                console.log("error token")
            })
    }, [])

    useEffect(() => {
        if (authState.isLoginToken === true && authState.errorLogin !== null) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: "AuthStack"
                }]
            })
        }
    }, [authState.errorLogin])

    const saveToken = useCallback(
        async () => {
            if (authState.isLoginToken === true && authState.user !== null) {
                const token = authState.user.token
                try {
                    await AsyncStorage.setItem("token", token)
                    const role = authState.user.role
                    if (role === "admin") {
                        navigation.navigate('AdminDrawer')
                    }
                    else {
                        navigation.navigate('MainDrawer')
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        },
        [authState.user],
    )

    useEffect(() => {
        saveToken()
    }, [saveToken])

    return (
        <View style={styles.container}>
            <BoldText style={styles.titleText}>
                THE SHOP APP
            </BoldText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 20,
        color: Colors.accent,
    }
})

export default Splash