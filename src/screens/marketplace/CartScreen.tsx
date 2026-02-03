import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CART_ITEMS = [
    {
        id: '1',
        title: 'Soya Milk',
        price: 50,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1624456729094-1a938c5d1e2e?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: '2',
        title: 'Soya Chunks',
        price: 60,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1610452264853-2c1dd7c4c329?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: '3',
        title: 'Soya Beans',
        price: 45,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1594248478440-424a56a62308?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: '4',
        title: 'Soya Flour',
        price: 35,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1610452264853-2c1dd7c4c329?auto=format&fit=crop&q=80&w=100'
    },
];

const CartScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={['#1a0033', '#3a005f']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
                <TouchableOpacity>
                    <View style={styles.iconButton}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {CART_ITEMS.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemPrice}>Rs {item.price}</Text>
                        </View>
                        <View style={styles.qtyControl}>
                            <TouchableOpacity style={styles.qtyBtn}><Ionicons name="remove" size={16} color="#fff" /></TouchableOpacity>
                            <Text style={styles.qtyText}>{item.qty}</Text>
                            <TouchableOpacity style={styles.qtyBtn}><Ionicons name="add" size={16} color="#fff" /></TouchableOpacity>
                        </View>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>Rs 1200</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>Rs 100</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>Rs 1300</Text>
                </View>

                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => navigation.navigate('Shipping')}
                >
                    <Text style={styles.checkoutBtnText}>Proceed To Checkout</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 15,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
    },
    itemDetails: {
        flex: 1,
    },
    itemTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
    },
    itemPrice: {
        color: '#ccc',
        fontSize: 14,
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    qtyBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        color: '#fff',
        fontSize: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        color: '#ccc',
        fontSize: 14,
    },
    summaryValue: {
        color: '#fff',
        fontSize: 14,
    },
    totalRow: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 15,
    },
    totalLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutBtn: {
        backgroundColor: '#7b1fa2', // Purple accent
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
    },
    checkoutBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen;
