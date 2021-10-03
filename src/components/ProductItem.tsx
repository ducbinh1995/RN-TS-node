import React, { FC } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { HOST_IMAGE } from '../api/api'
import { Product } from '../models/product'
import Card from './Card'
import DefaultText from './DefaultText'

const ProductItem: FC<{ product: Product, onSelect: () => void }> = (props) => {
    return (
        <Card style={styles.product}>
            <View style={styles.touchable}>
                <TouchableOpacity onPress={props.onSelect}>
                    <View>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{
                                    uri: HOST_IMAGE + props.product.image
                                }}
                            />
                        </View>
                        <View style={styles.details}>
                            <DefaultText style={styles.title}>{props.product.title}</DefaultText>
                            <DefaultText style={styles.price}>${props.product.price.toFixed(2)}</DefaultText>
                        </View>
                        <View style={styles.actions}>
                            {props.children}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 20
    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    details: {
        alignItems: 'center',
        height: '17%',
        padding: 10
    },
    title: {
        // fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2
    },
    price: {
        // fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '23%',
        paddingHorizontal: 20
    }
});

export default ProductItem;