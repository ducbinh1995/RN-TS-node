import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loading = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" style={styles.loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    loading: {
        ...StyleSheet.absoluteFillObject
    }
})

export default Loading;