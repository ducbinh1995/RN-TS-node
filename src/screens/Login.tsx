import React, { useState, useEffect, useCallback } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BoldText from '../components/BoldText';
import DefaultText from '../components/DefaultText';
import DefaultButton from '../components/DefaultButton';
import Colors from '../constants/Colors';
import LinkButton from '../components/LinkButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/AuthStack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { loginActions, loginReset, logout } from '../store/actions/auth';
import { AuthState } from '../store/reducers/auth';
import Loading from '../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStackParamList } from '../routes/MainStack';
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>
type MainProps = NativeStackScreenProps<MainStackParamList, 'AuthStack'>

const Login = () => {
    const navigation = useNavigation<Props["navigation"]>()
    const mainNavigation = useNavigation<MainProps["navigation"]>()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const dispatch = useDispatch<AppDispatch>()
    const authState = useSelector<RootState, AuthState>(state => state.authReducer)

    const onLogin = () => {
        loginActions(dispatch, email, password, undefined, false)
    }

    useFocusEffect(
        useCallback(
            () => {
                dispatch(logout())
            },
            [],
        )
    )

    useEffect(() => {
        if (authState.isLoginToken === false && authState.errorLogin !== null) {
            Alert.alert("Error", authState.errorLogin.message)
        }
    }, [authState.errorLogin])

    const saveToken = useCallback(
        async () => {
            if (authState.isLoginToken === false && authState.user !== null) {
                const token = authState.user.token
                try {
                    await AsyncStorage.setItem("token", token)
                    const role = authState.user.role
                    if (role === "admin") {
                        mainNavigation.replace('AdminDrawer')
                    }
                    else {
                        mainNavigation.replace('MainDrawer')
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
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={styles.container}>
                <BoldText style={styles.loginText}>
                    THE SHOP APP
                </BoldText>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.input, { marginTop: 15 }]}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <DefaultButton
                    style={styles.loginBtn}
                    onPress={onLogin}
                >
                    <DefaultText style={styles.loginBtnTitle}>
                        Login
                    </DefaultText>
                </DefaultButton>
                <LinkButton
                    style={styles.linkButton}
                    onPress={() => navigation.navigate('Register')}
                >
                    Don't have an account? Signup
                </LinkButton>
            </View>
            {authState.isFetchingLogin && <Loading />}
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 20,
        color: Colors.accent,
        textAlign: 'center'
    },
    input: {
        marginHorizontal: 20,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 30,
        fontFamily: 'open-sans',
        paddingHorizontal: 10
    },
    loginBtn: {
        height: 40,
        marginTop: 30,
        width: 120,
        borderRadius: 20,
        alignSelf: 'center'
    },
    loginBtnTitle: {
        fontSize: 16,
        color: 'white',
    },
    linkButton: {
        marginTop: 30,
        alignSelf: 'center'
    }
})

export default Login;