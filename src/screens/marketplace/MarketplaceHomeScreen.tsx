import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useSelector } from 'react-redux';


const MarketplaceHomeScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: any) => state.auth.user);
    const token = user?.token || user?.access_token;

    useEffect(() => {
        if (user?._id) {
            fetchProducts();
        }
    }, [user]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/orders/products`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = products.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderListing = ({ item }: any) => {
        const isOutOfStock = item.stock <= 0;
        return (
            <TouchableOpacity
                style={[styles.listingItem, isOutOfStock && { opacity: 0.6 }]}
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
            >
                <View style={styles.listingInfo}>
                    <Text style={styles.listingLabel}>{item.category || 'Sport Gear'}</Text>
                    <Text style={styles.listingTitle}>{item.name}</Text>
                    <Text style={styles.listingPrice}>Rs {item.price}</Text>
                    {isOutOfStock && (
                        <Text style={styles.outOfStockText}>Out of Stock</Text>
                    )}
                </View>
                <Image
                    source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1638531952329-87c2b3af695c?auto=format&fit=crop&q=80&w=200' }}
                    style={styles.listingImage}
                />
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Market Place</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('YourCoinsScreen')}>
                        <View style={styles.iconButton}>
                            <Ionicons name="cash-outline" size={20} color="#F5C542" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                        <View style={styles.iconButton}>
                            <Ionicons name="receipt-outline" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
                <TextInput
                    placeholder="Search sports gear..."
                    placeholderTextColor="#ccc"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Listings */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <FlatList
                    data={filteredItems}
                    renderItem={renderListing}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listingsList}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No items found</Text>
                    }
                />
            )}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginBottom: 20,
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    listingsList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    listingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        paddingBottom: 15,
    },
    listingInfo: {
        flex: 1,
        marginRight: 15,
    },
    listingLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    listingTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    listingPrice: {
        color: '#ccc',
        fontSize: 14,
    },
    outOfStockText: {
        color: '#ff4d4d',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
    sellerName: {
        color: '#aaa',
    },
    listingImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#333',
    },
    emptyText: {
        color: '#ccc',
        textAlign: 'center',
        marginTop: 50,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default MarketplaceHomeScreen;
