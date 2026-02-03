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

const ITEMS = [
    {
        id: '1',
        title: 'Soya Milk',
        qty: 1,
        image: 'https://images.unsplash.com/photo-1624456729094-1a938c5d1e2e?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: '2',
        title: 'Soya Flour',
        qty: 2,
        image: 'https://images.unsplash.com/photo-1610452264853-2c1dd7c4c329?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: '3',
        title: 'Soya Chunks',
        qty: 1,
        image: 'https://images.unsplash.com/photo-1594248478440-424a56a62308?auto=format&fit=crop&q=80&w=100'
    },
];

const OrderDetailsScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    // In a real app, we would get order details from route.params
    const orderId = '#1234567890';
    const status = 'Shipped';

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
                <Text style={styles.headerTitle}>Order Details</Text>
                <TouchableOpacity>
                    <View style={styles.iconButton}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.orderHeader}>
                    <Text style={styles.label}>Order Number</Text>
                    <Text style={styles.value}>{orderId}</Text>
                </View>
                <View style={styles.orderHeader}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.status}>{status}</Text>
                </View>

                <View style={styles.itemsList}>
                    {ITEMS.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <View>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemQty}>Quantity: {item.qty}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Shipping Address</Text>
                <Text style={styles.address}>
                    123 Elm Street, Apt 4B, Springfield, IL 62704
                </Text>

                <Text style={styles.sectionTitle}>Payment Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>Rs 2500</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>Rs 500</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax</Text>
                    <Text style={styles.summaryValue}>Rs 250</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>Rs 3250</Text>
                </View>

                <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() => navigation.navigate('TrackOrder')}
                >
                    <Text style={styles.trackBtnText}>Track Delivery</Text>
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
        paddingBottom: 40,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        color: '#ccc',
        fontSize: 14,
    },
    value: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    status: {
        color: '#4caf50',
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemsList: {
        marginTop: 20,
        marginBottom: 30,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
        backgroundColor: '#333',
    },
    itemTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
    },
    itemQty: {
        color: '#aaa',
        fontSize: 12,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    address: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 30,
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
        marginBottom: 30,
    },
    totalLabel: {
        color: '#fff',
        fontSize: 16,
    },
    totalValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    trackBtn: {
        backgroundColor: '#5e35b1', // Deep purple
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    trackBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrderDetailsScreen;
