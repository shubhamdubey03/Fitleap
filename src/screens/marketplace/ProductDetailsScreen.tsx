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

const ProductDetailsScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { product } = route.params || {
        product: {
            title: 'Adjustable Dumbbell Set',
            price: 'Rs 1500.00',
            seller: 'Ethan Carter',
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
            description: 'This adjustable dumbbell set is perfect for home workouts. It includes a variety of weight plates to customize your workout intensity. Barely used, in excellent condition.'
        }
    };

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
                    {product.description || 'This adjustable dumbbell set is perfect for home workouts. It includes a variety of weight plates to customize your workout intensity. Barely used, in excellent condition.'}
                </Text>

                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.price}>{product.price}</Text>

                <Text style={styles.sellerLabel}>Seller</Text>
                <View style={styles.sellerRow}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=' + product.seller }}
                        style={styles.sellerAvatar}
                    />
                    <View>
                        <Text style={styles.sellerName}>{product.seller}</Text>
                        <Text style={styles.sellerRating}>4.8 (127 reviews)</Text>
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.messageBtn}>
                        <Text style={styles.messageBtnText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buyBtn}
                        onPress={() => navigation.navigate('Cart')}
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
    messageBtn: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    messageBtnText: {
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
