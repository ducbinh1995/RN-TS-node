import React from 'react';
import { StyleSheet, View } from 'react-native';
import DefaultButton from './DefaultButton';
import DefaultText from './DefaultText';
import { Ionicons } from '@expo/vector-icons';
import BoldText from './BoldText';

const CartItem: React.FC<{ quantity: number, title: string, amount: number, onRemove?: () => void }> = (props) => {

    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <DefaultText style={styles.quantity}>{props.quantity} </DefaultText>
                <BoldText style={styles.mainText}>{props.title}</BoldText>
            </View>
            <View style={styles.itemData}>
                <DefaultText style={styles.mainText}>${props.amount.toFixed(2)}</DefaultText>
                {props.onRemove &&
                    <DefaultButton
                        onPress={props.onRemove}
                        style={styles.deleteButton}
                    >
                        <Ionicons name="md-trash" size={24} color="red" />
                    </DefaultButton>
                }
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    quantity: {
        color: '#888',
        fontSize: 16
    },
    mainText: {
        fontSize: 16
    },
    deleteButton: {
        marginLeft: 20,
        backgroundColor: 'transparent'
    }
});

export default CartItem;