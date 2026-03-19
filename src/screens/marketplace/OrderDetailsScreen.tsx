import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native'; // Removed to fix static flag error
import AsyncStorage from '@react-native-async-storage/async-storage';




const OrderDetailsScreen = ({ navigation, route }: { navigation: any, route: any }) => {
    const insets = useSafeAreaInsets();
    const { order } = route.params || {}
    console.log("orderaaaaaaaaaaaa", order);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
            case 'paid': return '#ff9800';
            case 'confirmed': return '#2196f3';
            case 'packed': return '#9c27b0';
            case 'shipped': return '#3f51b5';
            case 'out_for_delivery': return '#e91e63';
            case 'delivered': return '#4caf50';
            case 'cancelled': return '#f44336';
            default: return '#757575';
        }
    };

    const getStatusDisplay = (status: string) => {
        if (!status) return 'Pending';
        if (status === 'paid') return 'Pending';
        return status.replace(/_/g, ' ').toUpperCase();
    };

    if (!order) {
        return (
            <LinearGradient colors={['#1a0033', '#3b014f', '#5a015a']} style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#fff' }}>Order details unavailable.</Text>
            </LinearGradient>
        );
    }

    // Handle both new flat structure (order IS the item) and old nested structure
    const items = order.items && order.items.length > 0 ? order.items : [order];

    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.iconButton}>
                        <Ionicons name="close" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.detailsCard}>
                    <Text style={styles.label}>Order ID</Text>
                    <Text style={styles.value}>{order.id}</Text>

                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>{new Date(order.created_at).toLocaleString()}</Text>

                    <Text style={styles.label}>Payment Status</Text>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusBadge, { backgroundColor: (order.status === 'paid' ? '#4caf50' : '#ff9800') + '33' }]}>
                            <Text style={[styles.statusText, { color: order.status === 'paid' ? '#4caf50' : '#ff9800' }]}>
                                {order.status ? order.status.toUpperCase() : 'PENDING'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.label}>Delivery Status</Text>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.delivery_status || 'pending') + '33' }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(order.delivery_status || 'pending') }]}>
                                {getStatusDisplay(order.delivery_status || 'pending')}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.label}>Total Amount</Text>
                    <Text style={styles.value}>Rs {order.total_price}</Text>

                    <Text style={styles.label}>Address</Text>
                    <Text style={styles.value}>{order.addresses.address1},
                        {order.addresses.address2 && `, ${order.addresses.address2}`}
                        {order.addresses.city}, {order.addresses.states?.name} - {order.addresses.pincode}</Text>
                </View>



                <Text style={styles.sectionTitle}>Items</Text>
                {items.length > 0 ? items.map((item: any, index: number) => (
                    <View key={index} style={styles.itemCard}>
                        <Image
                            source={{ uri: item.products?.image_url || 'https://images.unsplash.com/photo-1624456729094-1a938c5d1e2e' }}
                            style={styles.itemImage}
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{item.products?.name || 'Product'}</Text>
                            <Text style={styles.itemPrice}>Rs {item.total_price} x {item.quantity}</Text>
                        </View>
                    </View>
                )) : (
                    <Text style={{ color: '#aaa' }}>No items information</Text>
                )}

                {/* <TouchableOpacity
                    style={styles.helpBtn}
                    onPress={() => Alert.alert('Support', 'Contacting support...')}
                >
                    <Text style={styles.helpBtnText}>Need Help?</Text>
                </TouchableOpacity> */}
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
    detailsCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    label: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    value: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 15,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemPrice: {
        color: '#ccc',
        fontSize: 14,
    },
    helpBtn: {
        marginTop: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    helpBtnText: {
        color: '#fff',
        fontSize: 16,
    },

    statusRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default OrderDetailsScreen;
