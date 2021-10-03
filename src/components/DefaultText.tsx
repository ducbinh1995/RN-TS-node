import React, { FC } from 'react';
import { Text, StyleSheet } from 'react-native';

const DefaultText: FC<{ style: {} }> = (props) => {
    return (
        <Text style={[styles.text, props.style]}>
            {props.children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'open-sans'
    }
});

export default DefaultText;