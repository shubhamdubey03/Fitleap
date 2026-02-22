import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
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
import { API_BASE_URL } from '../../config/api';
import { Linking } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { Alert } from 'react-native';


const OrdersScreen = ({ navigation }: { navigation: any }) => {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('Active');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: any) => state.auth.user);

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const fetchOrders = async () => {
        try {
            if (!user) {
                console.log("No user found, skipping fetch.");
                setLoading(false);
                return;
            }

            const token = user.token || user.access_token;
            if (!token) {
                console.log("No token found, skipping fetch.");
                setLoading(false);
                return;
            }

            console.log("Fetching orders...");
            // Use the new endpoint that gets user ID from token
            const response = await axios.get(
                `${API_BASE_URL}/orders/user`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("*******************************");
            console.log("Orders fetched:", response.data.length, response.data);
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = (url) => {
        if (!url) {
            Alert.alert("Invoice not available yet");
            return;
        }

        const { dirs } = RNFetchBlob.fs;

        RNFetchBlob.config({
            fileCache: true,
            path: `${dirs.DownloadDir}/invoice-${Date.now()}.pdf`
        })
            .fetch('GET', url)
            .then(() => {
                Alert.alert("Success", "Invoice downloaded");
            })
            .catch(err => {
                console.log(err);
                Alert.alert("Download failed");
            });
    };
    const filteredOrders = orders; // For now show all, can implement status filter later

    const renderOrder = ({ item }: { item: any }) => {
        // Get first item details for display
        const firstItem = item.items && item.items[0];
        const productTitle = firstItem?.product?.name || 'Order Item';
        const productImage = firstItem?.product?.image_url || 'https://images.unsplash.com/photo-1624456729094-1a938c5d1e2e';

        return (
            <TouchableOpacity
                style={styles.orderItem}
                onPress={() => navigation.navigate('OrderDetails', { order: item })}
            >
                <Image source={{ uri: productImage }} style={styles.orderImage} />
                <View style={styles.orderDetails}>
                    <Text style={styles.orderNumber}>Order ID: <Text style={styles.orderNumberBold}>{item.id.substring(0, 8)}</Text></Text>
                    <Text style={styles.orderDate}>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
                    <Text style={styles.orderTotal}>Total: Rs {item.total_price}</Text>
                    <Text style={[styles.orderStatus, { color: item.status === 'paid' ? '#4caf50' : '#ff9800' }]}>
                        {item.status.toUpperCase()}
                    </Text>
                    <Text style={{ color: 'white' }}>Address:
                        {item.addresses.address1}
                        {item.addresses.address2 && `, ${item.addresses.address2}`}
                    </Text>
                    <Text style={styles.orderTotal}>
                        {item.addresses.city}, {item.addresses.states?.name} - {item.addresses.pincode}
                    </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#fff" />

                <TouchableOpacity
                    style={styles.invoiceBtn}
                    onPress={() => downloadInvoice(item.invoice_url)}
                >
                    <Text style={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                        Download Invoice
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3a005f']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('MarketplaceHome')}>
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
                    <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>All Orders</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredOrders}
                renderItem={renderOrder}
                keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={{ color: '#ccc', textAlign: 'center', marginTop: 50 }}>No orders found.</Text>
                }
                initialNumToRender={8}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
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
    orderStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
    invoiceBtn: {
        marginTop: 10,
        alignSelf: 'flex-start',
        borderWidth: 1.5,
        borderColor: '#7b1fa2',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: 'transparent'
    },
});

export default OrdersScreen;
