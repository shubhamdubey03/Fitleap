import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useSelector } from 'react-redux';

const ProductDetailsScreen = ({ navigation, route }: { navigation: any, route: any }) => {
    const insets = useSafeAreaInsets();
    const initialProduct = route.params?.product;
    const user = useSelector((state: any) => state.auth.user);
    const token = user?.token || user?.access_token;

    const [product, setProduct] = useState<any>(initialProduct || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?._id) {
            fetchProductDetails();
        }
    }, [user]);

    const fetchProductDetails = async () => {
        try {
            const productId = initialProduct?.id || initialProduct?._id;
            console.log("Fetching details with token:", token);
            console.log("Full user object in state:", JSON.stringify(user));

            if (!productId) {
                setLoading(false);
                return;
            }
            const response = await axios.get(
                `${API_BASE_URL}/products/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Map backend fields (name -> title, image_url -> image) if needed, or just handle in JSX
            const data = response.data;
            if (data) {
                setProduct({
                    ...data,
                    title: data.name || data.title,
                    image: data.image_url || data.image,
                    price: data.price, // Ensure price is formatted or exists
                    description: data.description,
                    seller: data.seller // might be undefined
                });
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };


    if (loading && !product) {
        return (
            <LinearGradient
                colors={['#1a0033', '#3b014f', '#5a015a']}
                style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}
            >
                <ActivityIndicator size="large" color="#fff" />
            </LinearGradient>
        );
    }

    if (!product) {
        return (
            <LinearGradient
                colors={['#1a0033', '#3b014f', '#5a015a']}
                style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}
            >
                <Text style={{ color: '#fff' }}>Product not found</Text>
            </LinearGradient>
        );
    }

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
                <Text style={styles.headerTitle}>Listing Details</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Gallery / Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.productImage} />
                </View>

                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.description}>
                    {product.description || 'No description available for this product.'}
                </Text>

                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.price}>{product.price}</Text>

                <Text style={styles.sellerLabel}>Seller</Text>
                <View style={styles.sellerRow}>
                    <View>
                        <Text style={styles.sellerName}>{product.seller || 'FitLeap Vendor'}</Text>
                    </View>
                </View>

                {product.stock <= 0 ? (
                    <View style={styles.outOfStockBadge}>
                        <Ionicons name="alert-circle-outline" size={20} color="#ff4d4d" />
                        <Text style={styles.outOfStockText}>Currently Out of Stock</Text>
                    </View>
                ) : (
                    <View style={styles.actionButtons}>

                        <TouchableOpacity
                            style={styles.buyBtn}
                            onPress={() => navigation.navigate('Cart', { product: product })}
                        >
                            <Text style={styles.buyBtnText}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    imageContainer: {
        height: 250,
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 20,
    },
    priceLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 4,
    },
    price: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sellerLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 8,
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    sellerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    sellerName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    sellerRating: {
        color: '#ccc',
        fontSize: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    buyBtn: {
        flex: 1,
        backgroundColor: '#4a148c', // Darker purple/pink
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    buyBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    outOfStockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ff4d4d',
        gap: 8,
    },
    outOfStockText: {
        color: '#ff4d4d',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetailsScreen;
