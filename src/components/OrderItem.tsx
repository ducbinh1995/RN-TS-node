import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Colors from '../constants/Colors';
import { Cart } from '../models/cart';
import Card from './Card';
import CartItem from './CartItem';
import DefaultButton from './DefaultButton';
import DefaultText from './DefaultText';
import moment from 'moment';

const OrderItem: React.FC<{ total: number, date: Date, products: Cart[] }> = (props) => {

    const [showDetails, setShowDetails] = useState(false);

    const date = moment(props.date).format('MMMM Do YYYY, hh:mm');

    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <DefaultText style={styles.totalAmount}>${props.total.toFixed(2)}</DefaultText>
                <DefaultText style={styles.date}>{date}</DefaultText>
            </View>
            <DefaultButton
                style={styles.detailButton}
                onPress={() => {
                    setShowDetails(prevState => !prevState);
                }}>
                <DefaultText style={styles.buttonTitle}>
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </DefaultText>
            </DefaultButton>
            {showDetails && (
                <View style={styles.detailItems}>
                    {props.products.map(product => {
                        let amount = product.product.price * product.quantity
                        return (
                            <CartItem
                                key={product.product._id}
                                quantity={product.quantity}
                                amount={amount}
                                title={product.product.title}
                            />
                        )
                    })}
                </View>
            )}
        </Card>
    )
}

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount: {
        // fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        // fontFamily: 'open-sans',
        color: '#888'
    },
    detailItems: {
        width: '100%'
    },
    detailButton: {
        color: Colors.accent,
        height: 40,
        width: 120,
        borderRadius: 20,
        alignSelf: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16
    },
});

export default OrderItem;