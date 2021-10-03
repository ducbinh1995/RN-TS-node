import React, { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Colors from '../constants/Colors'

const LinkButton: FC<{ style: {}; onPress: () => void }> = (props) => {
    return (
        <TouchableOpacity
            style={props.style}
            onPress={props.onPress}
            activeOpacity={0.7}>
            <Text style={styles.buttonTitle}>
                {props.children}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonTitle: {
        color: Colors.blue,
        textDecorationLine: 'underline'
    }
})

export default LinkButton