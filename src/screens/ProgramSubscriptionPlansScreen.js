import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config/api';
import RazorpayCheckout from 'react-native-razorpay';

const ProgramSubscriptionPlansScreen = ({ navigation }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);
    const token = user?.token || user?.access_token;

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/pc/plan/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Plans fetched", response.data.plans)
            setPlans(response.data.plans || []);
        } catch (error) {
            console.error('Error fetching PC plans:', error);
            Alert.alert('Error', 'Failed to load subscription plans.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSelectPlan = async (plan) => {
        try {
            // 1. Create Order on Backend
            const orderRes = await axios.post(
                `${API_BASE_URL}/pc/subscribe/create-order`,
                { plan_id: plan.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { order, key: rzpKey } = orderRes.data;

            // 2. Open Razorpay Checkout
            const options = {
                description: plan.plan_name,
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: rzpKey,
                amount: order.amount,
                name: 'FitLeap Premium',
                order_id: order.id,
                prefill: {
                    email: user.email || '',
                    contact: user.phone || '',
                    name: user.name || ''
                },
                theme: { color: '#7b1fa2' }
            };

            RazorpayCheckout.open(options)
                .then(async (data) => {
                    // 3. Verify Payment
                    const verifyRes = await axios.post(
                        `${API_BASE_URL}/pc/subscribe/verify`,
                        { ...data, plan_id: plan.id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (verifyRes.status === 200) {
                        Alert.alert('Success', 'Subscription activated successfully!');
                        // Navigate back or refresh state
                        navigation.goBack();
                        // Note: You might want to update the global auth state too if it has is_subscribed
                    }
                })
                .catch((error) => {
                    console.error('Razorpay Error:', error);
                    if (error.description !== 'Payment Cancelled') {
                        Alert.alert('Error', error.description || 'Payment failed');
                    }
                });

        } catch (error) {
            console.error('Selection Error:', error);
            Alert.alert('Error', 'Failed to initiate purchase.');
        }
    };

    if (loading) {
        return (
            <LinearGradient colors={['#1a0033', '#3b014f']} style={styles.container}>
                <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#1a0033', '#3b014f', '#5a015a']} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Premium Plans</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Choose Your Plan</Text>
                <Text style={styles.subtitle}>Get unlimited access to official Programs & Challenges</Text>

                {plans.map((plan) => (
                    <TouchableOpacity
                        key={plan.id}
                        style={styles.planCard}
                        onPress={() => handleSelectPlan(plan)}
                    >
                        <View style={styles.planInfo}>
                            <Text style={styles.planName}>{plan.plan_name}</Text>
                            <Text style={styles.planDays}>{plan.days} Days</Text>
                            <Text style={styles.planDescription}>{plan.description}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceSymbol}>₹</Text>
                            <Text style={styles.priceText}>{plan.price}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {plans.length === 0 && (
                    <Text style={{ color: '#ccc', textAlign: 'center', marginTop: 50 }}>
                        No subscription plans available currently.
                    </Text>
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
        paddingTop: 50,
        paddingBottom: 20,
    },
    backBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    subtitle: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
        marginHorizontal: 30,
    },
    planCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    planInfo: {
        flex: 1,
    },
    planName: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    planDays: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 8,
    },
    planDescription: {
        color: '#ccc',
        fontSize: 12,
        lineHeight: 18,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: '#7b1fa2',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        marginLeft: 15,
    },
    priceSymbol: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 2,
    },
    priceText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ProgramSubscriptionPlansScreen;
