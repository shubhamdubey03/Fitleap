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



const CartScreen = ({ navigation, route }: { navigation: any, route: any }) => {
    const insets = useSafeAreaInsets();
    const { product } = route.params || {};
    // console.log("product", product)

    const [cartItems, setCartItems] = React.useState<any[]>([]);

    React.useEffect(() => {
        if (product) {
            // Check if item already exists
            const existing = cartItems.find(item => item.id === product.id);
            if (!existing) {
                // Determine price: remove 'Rs ' if string, or use number
                let priceVal = 0;
                if (typeof product.price === 'string') {
                    priceVal = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                } else {
                    priceVal = product.price;
                }

                const newItem = {
                    id: product.id,
                    title: product.name || product.title,
                    price: priceVal,
                    qty: 1,
                    image: product.image_url || product.image || 'https://images.unsplash.com/photo-1638531952329-87c2b3af695c'
                };

                // For demo simplicity, if "Buy Now" is clicked, let's just show THAT item in cart or add to it. 
                // Replacing for now to simulate "Buy Now" flow focusing on that item, 
                // or appending if you want a persistent cart (would need Redux/Context).
                // Let's append or putting it at top.
                setCartItems([newItem]); // Just showing the bought item for "Buy Now" flow smoothness as requested
            }
        }
    }, [product]);

    const incrementQty = (id: string) => {
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
    };

    const decrementQty = (id: string) => {
        setCartItems(prev => prev.map(item => item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item));
    };

    // Calculate Total
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = 0;
    const total = subtotal;

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
                <View style={{ flex: 1, alignItems: 'center', marginRight: 36 }}>
                    <Text style={styles.headerTitle}>Cart</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {cartItems.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemPrice}>Rs {item.price}</Text>
                        </View>
                        <View style={styles.qtyControl}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => decrementQty(item.id)}>
                                <Ionicons name="remove" size={16} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{item.qty}</Text>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => incrementQty(item.id)}>
                                <Ionicons name="add" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>Rs {subtotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>Rs {shipping}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>Rs {total}</Text>
                </View>

                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => navigation.navigate('Shipping', { items: cartItems, totalAmount: total })}
                >
                    <Text style={styles.checkoutBtnText}>Proceed To Checkout</Text>
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
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 15,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
    },
    itemDetails: {
        flex: 1,
    },
    itemTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
    },
    itemPrice: {
        color: '#ccc',
        fontSize: 14,
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    qtyBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        color: '#fff',
        fontSize: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
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
    },
    totalLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutBtn: {
        backgroundColor: '#7b1fa2', // Purple accent
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
    },
    checkoutBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen;
