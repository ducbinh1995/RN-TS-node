import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultText from '../components/DefaultText';
import DefaultButton from '../components/DefaultButton';
import Colors from '../constants/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/AuthStack';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { RegisterState } from '../store/reducers/register';
import { registerActions, registerReset } from '../store/actions/register';
import Loading from '../components/Loading';
import BoldText from '../components/BoldText';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>

const Register = () => {
    const navigation = useNavigation<Props["navigation"]>()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    const dispatch = useDispatch<AppDispatch>()
    const registerState = useSelector<RootState, RegisterState>(state => state.registerReducer)

    const onRegister = () => {
        registerActions(dispatch, email, password, confirmPassword)
    }

    useEffect(() => {
        if (registerState.errorRegister !== null) {
            dispatch(registerReset())
            Alert.alert("Error", registerState.errorRegister.message)
        }
    }, [registerState.errorRegister])

    useEffect(() => {
        if (registerState.registerSuccess === true) {
            // dispatch(registerReset())
            navigation.goBack()
        }
    }, [registerState.registerSuccess])

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
                <TextInput
                    style={[styles.input, { marginTop: 15 }]}
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <DefaultButton
                    style={styles.registerBtn}
                    onPress={onRegister}
                >
                    <DefaultText style={styles.registerBtnTitle}>
                        Register
                    </DefaultText>
                </DefaultButton>
            </View>
            {registerState.isFetchingRegister && <Loading />}
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
    registerBtn: {
        height: 40,
        marginTop: 30,
        width: 120,
        borderRadius: 20,
        alignSelf: 'center'
    },
    registerBtnTitle: {
        fontSize: 16,
        color: 'white',
    }
})

export default Register;