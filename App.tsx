import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import AuthStack from './src/routes/AuthStack';
import MainDrawer from './src/routes/MainDrawer';
import MainStack from './src/routes/MainStack';
import store from './src/store/store';

export default function App() {
    const [loadedFonts] = useFonts({
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
    })

    if (!loadedFonts) {
        return <AppLoading />
    }

    return (
        <Provider store={store}>
            <ActionSheetProvider>
                <NavigationContainer>
                    {/* <MainDrawer /> */}
                    <MainStack />
                </NavigationContainer>
            </ActionSheetProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
