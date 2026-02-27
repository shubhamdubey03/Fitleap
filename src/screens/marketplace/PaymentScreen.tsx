import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import RazorpayCheckout from 'react-native-razorpay';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';
import axios from 'axios';
import RazorpayCheckout from "react-native-razorpay";


const PAYMENT_METHODS = [

    { id: 'razorpay', name: 'Razorpay (UPI, Cards, Netbanking)' },

];

const PaymentScreen = ({ navigation, route }: { navigation: any, route: any }) => {
    const insets = useSafeAreaInsets();
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: any) => state.auth.user);

    // Get params or use defaults for testing
    let { totalAmount = 0, items = [], address_id, shippingDetails } = route.params || {};

    const handlePayment = async () => {
        if (selectedMethod !== 'razorpay') {
            Alert.alert('Selection Required', 'Please select Razorpay to proceed.');
            return;
        }

        if (!user || (!user.token && !user.access_token)) {
            Alert.alert('Auth Error', 'Please login to continue.');
            return;
        }

        try {
            setLoading(true);
            const token = user.token || user.access_token;
            console.log("Using Token:", token);

            if (!address_id) {
                Alert.alert("Error", "Delivery address missing. Please go back and select address.");
                return;
            }

            // 1️⃣ Create Internal Order
            const orderPayload = {
                total_amount: totalAmount,
                address_id: address_id,
                items: items.map((item: any) => ({
                    product_id: item.id,
                    quantity: item.qty || item.quantity || 1,
                    price: item.price
                }))
            };

            const orderRes = await axios.post(
                `${API_BASE_URL}/orders/create`,
                orderPayload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!orderRes.data || !orderRes.data[0]) {
                throw new Error("Failed to create order record on server.");
            }
            const internalOrderId = orderRes.data[0].id;
            console.log("Internal Order Created:", internalOrderId);

            // 2️⃣ Create Razorpay Order
            const paymentRes = await axios.post(`${API_BASE_URL}/payments/create`, {
                order_id: internalOrderId,
                amount: totalAmount
            },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!paymentRes.data || !paymentRes.data.id) {
                throw new Error("Failed to initiate payment gateway.");
            }

            const {
                id: razorpay_order_id,
                amount: rzpAmount,
                currency,
                key: rzpKey
            } = paymentRes.data;

            // 3️⃣ Open Razorpay Checkout
            const options = {
                description: 'FitLeap Order',
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: currency || 'INR',
                key: rzpKey,
                amount: rzpAmount,
                name: 'FitLeap',
                order_id: razorpay_order_id,
                prefill: {
                    email: String(user.email || ''),
                    contact: String(user.phone || user.mobile_number || ''),
                    name: String(user.name || '')
                },
                theme: { color: '#7b1fa2' }
            };

            // ⚡ OPTIMIZATION: Wait for UI thread to settle and keyboard to hide
            setTimeout(() => {
                setLoading(false); // STOP loading spinner BEFORE opening native screen (reduces CONTENTION)

                RazorpayCheckout.open(options)
                    .then(async (data: any) => {
                        console.log("Razorpay Success:", data);
                        await verifyPayment(data, internalOrderId, token);
                    })
                    .catch((error: any) => {
                        console.log("Razorpay Error/Cancel:", error);
                        const errorDesc = error.description || error.error?.description || "Payment Cancelled";
                        if (errorDesc !== "Payment Cancelled") {
                            Alert.alert('Payment Failed', errorDesc);
                        }
                    });
            }, 600); // 600ms is safer for older Android devices to avoid ANR

        } catch (err: any) {
            console.log("Payment Initialization Failed:", err);
            setLoading(false);
            const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Something went wrong";
            Alert.alert('Initialization Error', String(errMsg).substring(0, 100));
        }
    };

    const verifyPayment = async (paymentData: any, orderId: string, token: string) => {
        try {
            console.log("Payment Data Received from Razorpay:", paymentData);
            console.log("Order ID:", orderId);
            console.log("Token:", token);
            const verifyPayload = {
                ...paymentData,
                orderId: orderId,
                token: token
                // Ensure backend knows which internal order this is for
            };

            const res = await axios.post(
                `${API_BASE_URL}/payments/verify`,
                verifyPayload,
                { headers: { Authorization: `Bearer ${token}` } } // Optional if verify endpoint is public
            );

            if (res.status === 200) {
                Alert.alert('Success', 'Order placed successfully! 🎉', [
                    { text: 'View Orders', onPress: () => navigation.navigate('Orders') }
                ]);
            } else {
                Alert.alert('Verification Failed', 'Payment reported success but backend verification failed.');
            }

        } catch (err: any) {
            console.log("Verification Error");
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Verification failed";
            Alert.alert('Verification Error', String(errMsg), [
                { text: 'OK', onPress: () => navigation.navigate('Orders') } // Navigate anyway so they can check status later
            ]);
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
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Options</Text>
                <TouchableOpacity>
                    <View style={styles.iconButton}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.amountText}>Total Amount: Rs {totalAmount}</Text>
                <Text style={styles.sectionTitle}>Select Payment Method</Text>

                {PAYMENT_METHODS.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[
                            styles.methodItem,
                            selectedMethod === method.id && styles.selectedMethodItem
                        ]}
                        onPress={() => setSelectedMethod(method.id)}
                    >
                        <Text style={styles.methodName}>{method.name}</Text>
                        <View style={styles.radioOuter}>
                            {selectedMethod === method.id && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Card Form placeholder logic skipped for brevity since we focus on Razorpay */}

                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.checkoutBtnText}>
                            {selectedMethod === 'razorpay' ? 'Pay Now' : 'Complete Purchase'}
                        </Text>
                    )}
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
        paddingBottom: 40,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 15,
        fontWeight: '600',
    },
    methodItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        marginBottom: 10,
    },
    selectedMethodItem: {
        borderColor: '#7b1fa2',
        backgroundColor: 'rgba(123, 31, 162, 0.1)',
    },
    methodName: {
        color: '#fff',
        fontSize: 14,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    cardForm: {
        marginTop: 20,
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 15,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        fontSize: 16,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkboxLabel: {
        color: '#ccc',
        fontSize: 14,
        marginLeft: 10,
    },
    checkoutBtn: {
        backgroundColor: '#7b1fa2', // Purple accent
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    checkoutBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    amountText: {
        color: '#ffeb3b',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default PaymentScreen;
