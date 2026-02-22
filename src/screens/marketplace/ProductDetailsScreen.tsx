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
    const token = useSelector((state: any) => state.auth.token);

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

    const handleAddToCart = () => {
        Alert.alert("Success", "Item added to cart successfully!");
    };

    if (loading && !product) {
        return (
            <LinearGradient
                colors={['#1a0033', '#3a005f']}
                style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}
            >
                <ActivityIndicator size="large" color="#fff" />
            </LinearGradient>
        );
    }

    if (!product) {
        return (
            <LinearGradient
                colors={['#1a0033', '#3a005f']}
                style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}
            >
                <Text style={{ color: '#fff' }}>Product not found</Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#1a0033', '#3a005f']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.iconButton}>
                        <Ionicons name="close" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Listing Details</Text>
                <TouchableOpacity>
                    <View style={styles.iconButton}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
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
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=' + (product.seller || 'default') }}
                        style={styles.sellerAvatar}
                    />
                    <View>
                        <Text style={styles.sellerName}>{product.seller || 'FitLeap Vendor'}</Text>
                        <Text style={styles.sellerRating}>4.8 (127 reviews)</Text>
                    </View>
                </View>

                {/* Updated Action Buttons: Add to Cart and Buy Now (No Message Button) */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
                        <Text style={styles.addToCartBtnText}>Add to Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buyBtn}
                        onPress={() => navigation.navigate('Cart', { product: product })}
                    >
                        <Text style={styles.buyBtnText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
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
    addToCartBtn: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)'
    },
    addToCartBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
});

export default ProductDetailsScreen;
