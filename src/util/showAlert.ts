import { Alert, AlertButton } from "react-native";

export const showAlertError = (message: string, actions?: AlertButton[]) => {
    Alert.alert("Error", message, actions)
}

export const showAlert = (title: string, message: string, actions?: AlertButton[]) => {
    Alert.alert(title, message, actions)
}