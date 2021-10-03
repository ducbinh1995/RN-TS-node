import React, { FC } from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

const BoldText: FC<{ style: {} }> = (props) => {
    return (
        <Text style={[styles.text, props.style]}>
            {props.children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'open-sans-bold'
    }
});

export default BoldText;