import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const VendorDashboardScreen = ({ navigation }) => {
    const [vendorName, setVendorName] = useState('Vendor');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalEarnings: 0
    });
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;

    useFocusEffect(
        React.useCallback(() => {
            if (token) {
                fetchDashboardData();
            }
        }, [token])
    );

    const fetchDashboardData = async () => {
        try {
            if (!token) return;

            // Fetch Products
            const prodRes = await axios.get(`${API_BASE_URL}/orders/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(prodRes.data);

            // Fetch Orders
            const orderRes = await axios.get(`${API_BASE_URL}/orders/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(orderRes.data);

            // Calculate Stats
            const earnings = orderRes.data.reduce((acc, curr) => acc + (curr.total_price || 0), 0);
            setStats({
                totalOrders: orderRes.data.length,
                totalProducts: prodRes.data.length,
                totalEarnings: earnings
            });

            // Get Vendor Name from Storage as fallback, prefer Redux user name
            const storedName = await AsyncStorage.getItem('VENDOR_NAME');
            setVendorName(user?.name || storedName || 'Vendor');

        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
            // Optionally set some error state or toast if needed
        }
    };

    const handleLogout = async () => {
        await dispatch(logout()).unwrap();
        // Fallback or exact clears matching existing codebase pattern just in case
        await AsyncStorage.removeItem('IS_LOGGED_IN');
        await AsyncStorage.removeItem('USER_ROLE');
        await AsyncStorage.removeItem('VENDOR_NAME');
        navigation.replace('Login');
    };

    return (
        <LinearGradient
            colors={['#1a0b2e', '#2b0040', '#130026']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#1a0b2e" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.greeting}>Hello {vendorName}</Text>
                            <Text style={styles.subGreeting}>Vendor Portal</Text>
                        </View>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                            <Ionicons name="log-out-outline" size={24} color="#FF6B3D" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons name="notifications-outline" size={24} color="#FF6B3D" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Total Earnings Card */}
                <LinearGradient
                    colors={['#FF6B3D', '#FF8E53']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.earningsCard}
                >
                    <View>
                        <Text style={styles.earningsLabel}>Total Earnings</Text>
                        <Text style={styles.earningsValue}>₹{stats.totalEarnings.toLocaleString()}</Text>
                        <Text style={styles.earningsSub}>Updated just now</Text>
                    </View>
                    <Ionicons name="wallet-outline" size={40} color="#fff" />
                </LinearGradient>

                {/* Stats Row */}
                <View style={styles.row}>
                    {/* Orders */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(46, 204, 113, 0.2)' }]}>
                            <Ionicons name="cart-outline" size={24} color="#2ECC71" />
                        </View>
                        <Text style={styles.statValue}>{stats.totalOrders}</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>

                    {/* Products */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(74, 144, 226, 0.2)' }]}>
                            <Ionicons name="cube-outline" size={24} color="#4A90E2" />
                        </View>
                        <Text style={styles.statValue}>{stats.totalProducts}</Text>
                        <Text style={styles.statLabel}>Products</Text>
                    </View>
                    {/* Active */}
                    <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Marketplace')}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 215, 0, 0.2)' }]}>
                            <Ionicons name="eye-outline" size={24} color="#FFD700" />
                        </View>
                        <Text style={styles.statValue}>View</Text>
                        <Text style={styles.statLabel}>Store</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="add-circle-outline" size={28} color="#fff" />
                        <Text style={styles.actionText}>Add Product</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="stats-chart-outline" size={28} color="#fff" />
                        <Text style={styles.actionText}>Analytics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="settings-outline" size={28} color="#fff" />
                        <Text style={styles.actionText}>Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Orders */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.ordersList}>
                    {orders.slice(0, 3).map((order) => (
                        <View key={order.id} style={styles.orderItem}>
                            <View style={styles.orderLeft}>
                                <View style={styles.orderIcon}>
                                    <Ionicons name="bag-handle-outline" size={20} color="#FF6B3D" />
                                </View>
                                <View>
                                    <Text style={styles.orderId}>Order #{String(order.id).slice(-6)}</Text>
                                    <Text style={styles.orderDate}>{order.products?.name || 'Item'}</Text>
                                </View>
                            </View>
                            <Text style={styles.orderAmount}>₹{order.total_price}</Text>
                        </View>
                    ))}
                    {orders.length === 0 && (
                        <Text style={{ color: '#aaa', textAlign: 'center' }}>No orders yet</Text>
                    )}
                </View>

                {/* Your Products */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your Products</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Marketplace')}>
                        <Text style={styles.seeAll}>Manage</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.productsList}>
                    {products.slice(0, 5).map((product) => (
                        <View key={product.id} style={styles.productItem}>
                            <Image
                                source={{ uri: product.image_url || 'https://images.unsplash.com/photo-1599058917212-d750089bc07e' }}
                                style={styles.productThumb}
                            />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productStock}>Stock: {product.stock}</Text>
                            </View>
                            <Text style={styles.productPrice}>₹{product.price}</Text>
                        </View>
                    ))}
                    {products.length === 0 && (
                        <Text style={{ color: '#aaa', textAlign: 'center' }}>No products listed</Text>
                    )}
                </View>

            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    greeting: {
        color: '#ccc',
        fontSize: 14,
    },
    subGreeting: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    iconBtn: {
        padding: 5,
    },
    earningsCard: {
        borderRadius: 20,
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: "#FF6B3D",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    earningsLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 5,
    },
    earningsValue: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    earningsSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        width: (width - 60) / 3,
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        width: (width - 60) / 3,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        color: '#fff',
        marginTop: 8,
        fontSize: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    seeAll: {
        color: '#FF6B3D',
        fontSize: 14,
    },
    ordersList: {
        marginBottom: 20,
    },
    orderItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,107,61,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    orderId: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    orderDate: {
        color: '#aaa',
        fontSize: 12,
    },
    orderAmount: {
        color: '#FF6B3D',
        fontSize: 16,
        fontWeight: 'bold',
    },
    productsList: {
        marginBottom: 20,
    },
    productItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    productThumb: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    productStock: {
        color: '#aaa',
        fontSize: 12,
    },
    productPrice: {
        color: '#2ECC71',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default VendorDashboardScreen;
