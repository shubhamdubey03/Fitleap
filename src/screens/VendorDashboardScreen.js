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

const { width } = Dimensions.get('window');

const VendorDashboardScreen = ({ navigation }) => {
    const [vendorName, setVendorName] = useState('Vendor');

    useEffect(() => {
        const getVendorName = async () => {
            const name = await AsyncStorage.getItem('VENDOR_NAME');
            if (name) {
                setVendorName(name);
            }
        }
        getVendorName();
    }, []);

    const handleLogout = async () => {
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
                        <Text style={styles.earningsValue}>$12,450.00</Text>
                        <Text style={styles.earningsSub}>+15% from last month</Text>
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
                        <Text style={styles.statValue}>54</Text>
                        <Text style={styles.statLabel}>New Orders</Text>
                    </View>

                    {/* Products */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(74, 144, 226, 0.2)' }]}>
                            <Ionicons name="cube-outline" size={24} color="#4A90E2" />
                        </View>
                        <Text style={styles.statValue}>128</Text>
                        <Text style={styles.statLabel}>Products</Text>
                    </View>
                    {/* Clients */}
                    <View style={styles.statCard}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 215, 0, 0.2)' }]}>
                            <Ionicons name="people-outline" size={24} color="#FFD700" />
                        </View>
                        <Text style={styles.statValue}>320</Text>
                        <Text style={styles.statLabel}>Clients</Text>
                    </View>
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
                    {[1, 2, 3].map((item, index) => (
                        <View key={index} style={styles.orderItem}>
                            <View style={styles.orderLeft}>
                                <View style={styles.orderIcon}>
                                    <Ionicons name="bag-handle-outline" size={20} color="#FF6B3D" />
                                </View>
                                <View>
                                    <Text style={styles.orderId}>Order #234{item}</Text>
                                    <Text style={styles.orderDate}>2 mins ago</Text>
                                </View>
                            </View>
                            <Text style={styles.orderAmount}>$45.00</Text>
                        </View>
                    ))}
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
});

export default VendorDashboardScreen;
