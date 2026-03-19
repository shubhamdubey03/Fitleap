import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../../redux/authSlice';
import { API_BASE_URL } from '../../config/api';

const SubscriptionScreen = ({ navigation, route }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const coachId = route?.params?.coachId || null;
    const [loading, setLoading] = useState(false);
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        fetchCurrentSubscription();
        fetchCoachPlans();
        if (coachId) {
            fetchCoachPlans();
        }
    }, [coachId]);

    const fetchCurrentSubscription = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/v1/subscriptions`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            console.log("==========", res)
            const active = res.data.find(s => s.status === 'active');
            if (active) setActiveSubscription(active);
        } catch (e) {
            console.error("Fetch sub error:", e);
        }
    };

    const fetchCoachPlans = async () => {
        try {
            const url = coachId
                ? `${API_BASE_URL}/v1/subscriptions/${coachId}/plans`
                : `${API_BASE_URL}/v1/subscriptions/plans/all`;

            console.log("Fetching plans from:", url);
            const res = await axios.get(url);

            if (res.data.success && res.data.data) {
                const dynamicPlans = res.data.data.map(p => ({
                    id: p.id,
                    name: p.plan_name,
                    price: p.price,
                    months: p.duration_days ? Math.round(p.duration_days / 30) : 1,
                    features: Array.isArray(p.features) ? p.features : []
                }));
                setPlans(dynamicPlans);
                console.log("Loaded plans:", dynamicPlans);
            }
        } catch (e) {
            console.error("Fetch plans error:", e);
        }
    };


    const handleSubscribe = async (plan) => {
        if (!user) {
            Alert.alert("Error", "Please login to subscribe");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/v1/subscriptions`, {
                coach_id: coachId,
                months: plan.months,
                amount: plan.price,
                plan_id: plan.id
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const { order, subscription_id, key } = res.data;

            const options = {
                description: `Subscription for ${plan.name} Plan`,
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: key,
                name: 'FitLeap',
                order_id: order.id,
                prefill: {
                    email: user.email || '',
                    contact: user.phone || '',
                    name: user.name || ''
                },
                theme: { color: '#3b0a57' }
            };

            RazorpayCheckout.open(options).then(async (data) => {
                try {
                    const verifyRes = await axios.post(`${API_BASE_URL}/v1/subscriptions/verify`, {
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_signature: data.razorpay_signature,
                        subscription_id: subscription_id
                    }, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });

                    if (verifyRes.data.success) {
                        Alert.alert("Success", "Subscription activated successfully!");
                        // Refresh both local state and global Redux state
                        fetchCurrentSubscription();

                        // THIS IS IMPORTANT: Update Redux state to unlock Exercise Library and show coach on Dashboard
                        await dispatch(getProfile()).unwrap();

                        navigation.navigate('Dashboard', {
                            screen: 'Consultation',
                            params: { screen: 'Coaching' }
                        });
                    }
                } catch (err) {
                    console.error("Verification failed:", err);
                    Alert.alert("Error", "Payment verification failed. Please contact support.");
                }
            }).catch((error) => {
                console.log("Razorpay Error:", error);
                Alert.alert("Cancelled", "Payment was cancelled or failed.");
            });

        } catch (error) {
            console.error("Subscription initiation error:", error);
            Alert.alert("Error", error.response?.data?.error || "Failed to initiate subscription");
        } finally {
            setLoading(false);
        }
    };
    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Subscriptions</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Current Plan */}
                    <Text style={styles.sectionTitle}>Current Plan</Text>
                    <View style={styles.currentPlanCard}>
                        <View style={styles.planIconBox}>
                            <Ionicons name="star" size={24} color="#FFD700" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.planName}>
                                {activeSubscription ? `Premium (${activeSubscription.plan_type || 'Active'})` : 'Free Tier'}
                            </Text>
                            <Text style={styles.planExpiry}>
                                {activeSubscription ? `Expires on ${new Date(activeSubscription.end_date).toLocaleDateString()}` : 'Subscribe to unlock all features'}
                            </Text>
                        </View>
                        {/* {activeSubscription && (
                            <TouchableOpacity
                                style={styles.feedbackIconBtn}
                                onPress={() => navigation.navigate('FeedbackProgressScreen', {
                                    coachId: activeSubscription.coach_id,
                                    subscriptionId: activeSubscription.id
                                })}
                            >
                                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        )} */}
                    </View>

                    {/* Upgrade Your Plan */}
                    <Text style={styles.sectionTitle}>Upgrade Your Plan</Text>

                    {loading ? (
                        <ActivityIndicator color="#fff" size="large" style={{ marginVertical: 30 }} />
                    ) : (
                        plans.map((p) => (
                            <View key={p.id} style={styles.upgradeCard}>
                                <View style={styles.upgradeHeader}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <Text style={styles.upgradeType}>{p.name}</Text>
                                        {p.save && (
                                            <View style={styles.saveBadge}>
                                                <Text style={styles.saveText}>Save {p.save}</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.price}>₹{p.price}</Text>
                                        <Text style={styles.perPeriod}>/{p.id === 'monthly' ? 'month' : 'year'}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.selectButton}
                                    onPress={() => handleSubscribe(p)}
                                    disabled={loading}
                                >
                                    <Text style={styles.selectButtonText}>Select Plan</Text>
                                </TouchableOpacity>

                                <View style={styles.featureList}>
                                    {p.features.map((f, idx) => (
                                        <FeatureItem key={idx} text={f} />
                                    ))}
                                </View>
                            </View>
                        ))
                    )}

                    {/* Billing History (Optional placeholder) */}
                    <Text style={styles.sectionTitle}>Billing History</Text>
                    <View style={styles.billingList}>
                        {activeSubscription && (
                            <BillingItem
                                title={`Premium ${activeSubscription.plan_type}`}
                                date={new Date(activeSubscription.created_at).toLocaleDateString()}
                                price={`₹${activeSubscription.amount}`}
                            />
                        )}
                        {!activeSubscription && (
                            <Text style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>No billing history found.</Text>
                        )}
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const FeatureItem = ({ text }) => (
    <View style={styles.featureItem}>
        <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.featureText}>{text}</Text>
    </View>
);

const BillingItem = ({ title, date, price }) => (
    <View style={styles.billingItem}>
        <View>
            <Text style={styles.billingTitle}>{title}</Text>
            <Text style={styles.billingDate}>{date}</Text>
        </View>
        <Text style={styles.billingPrice}>{price}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 50, // Increased to match SettingsScreen and ensure status bar clearance
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        fontFamily: ' serif', // Trying to match the elegant font, though generic
    },
    coinIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#B8860B',
    },
    coinInner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 15,
        marginTop: 10,
        fontFamily: 'serif',
    },
    currentPlanCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    planIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    planName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    planExpiry: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
    },
    upgradeCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        marginBottom: 20,
    },
    upgradeHeader: {
        marginBottom: 15,
    },
    upgradeType: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 5,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
    },
    perPeriod: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 4,
    },
    selectButton: {
        backgroundColor: '#3b0a57', // Dark purple button
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    selectButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    saveBadge: {
        backgroundColor: '#5a2d8a',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    saveText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardIcon: {
        width: 40,
        height: 30,
        backgroundColor: '#332a45',
        borderRadius: 4,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    paymentExpiry: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginTop: 2,
    },
    billingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    billingTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    billingDate: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginTop: 2,
    },
    billingPrice: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    feedbackIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
});

export default SubscriptionScreen;
