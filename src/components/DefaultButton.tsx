import React, { FC } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../constants/Colors'

const DefaultButton: FC<{ style: {}, onPress: () => void, disabled?: boolean }> = (props) => {
    return (
        <TouchableOpacity
            style={[styles.button, props.style]}
            onPress={props.onPress}
            activeOpacity={0.7}
            disabled={props.disabled ? props.disabled : false}>
            {props.children}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default DefaultButton