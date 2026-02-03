import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ORDERS = [
    {
        id: '1',
        number: '768012',
        date: '15/05/24',
        total: '123.50',
        status: 'Delivered',
        image: 'https://images.unsplash.com/photo-1624456729094-1a938c5d1e2e?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: '2',
        number: '3445678',
        date: '23/04/24',
        total: '78.00',
        status: 'Processing',
        image: 'https://images.unsplash.com/photo-1610452264853-2c1dd7c4c329?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: '3',
        number: '901233',
        date: '21/02/24',
        total: '20.00',
        status: 'Delivered',
        image: 'https://images.unsplash.com/photo-1594248478440-424a56a62308?auto=format&fit=crop&q=80&w=100'
    },
    {
        id: '4',
        number: '567890',
        date: '12/06/23',
        total: '55.25',
        status: 'Delivered',
        image: 'https://images.unsplash.com/photo-1624456729094-1a938c5d1e2e?auto=format&fit=crop&q=80&w=100'
    },
];

const OrdersScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('Active');

    const renderOrder = ({ item }) => (
        <TouchableOpacity
            style={styles.orderItem}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.number })}
        >
            <Image source={{ uri: item.image }} style={styles.orderImage} />
            <View style={styles.orderDetails}>
                <Text style={styles.orderNumber}>Order number: <Text style={styles.orderNumberBold}>{item.number}</Text></Text>
                <Text style={styles.orderDate}>Order date: {item.date}</Text>
                <Text style={styles.orderTotal}>Total: ${item.total}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
    );

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
                <Text style={styles.headerTitle}>Orders</Text>
                <View style={{ width: 36 }} />
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Active' && styles.activeTab]}
                    onPress={() => setActiveTab('Active')}
                >
                    <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'History' && styles.activeTab]}
                    onPress={() => setActiveTab('History')}
                >
                    <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>History</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={ORDERS}
                renderItem={renderOrder}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
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
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    tabText: {
        color: '#aaa',
        fontSize: 16,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContent: {
        padding: 20,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 12,
    },
    orderImage: {
        width: 50,
        height: 70,
        borderRadius: 8,
        marginRight: 15,
        backgroundColor: '#333',
    },
    orderDetails: {
        flex: 1,
    },
    orderNumber: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 4,
    },
    orderNumberBold: {
        color: '#fff',
        fontWeight: 'bold',
    },
    orderDate: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 4,
    },
    orderTotal: {
        color: '#ffb74d',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default OrdersScreen;
