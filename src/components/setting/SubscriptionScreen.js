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
    Image,
    FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../../redux/authSlice';
import { API_BASE_URL } from '../../config/api';
import { useNavigation } from '@react-navigation/native';

const SubscriptionScreen = ({ route }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const coachId = route?.params?.coachId || null;
    const [loading, setLoading] = useState(false);
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [upcomingSubscription, setUpcomingSubscription] = useState(null);
    const [plans, setPlans] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [selectedCoachId, setSelectedCoachId] = useState(coachId);
    const [history, setHistory] = useState([]);
    const navigation = useNavigation()

    useEffect(() => {
        fetchCurrentSubscription();
        fetchAllCoaches();
    }, []);

    useEffect(() => {
        fetchCoachPlans(selectedCoachId);
    }, [selectedCoachId]);

    const fetchAllCoaches = async () => {
        if (!user?.token) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/coaches?is_approved=true`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCoaches(res.data.data);
        } catch (e) {
            console.error("Fetch coaches error:", e);
        }
    };

    const fetchCurrentSubscription = async () => {
        if (!user?.token) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/v1/subscriptions/`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            setHistory(res.data || []);
            const active = res.data.find(s => s.status === 'active');
            const upcoming = res.data.find(s => s.status === 'pending');

            setActiveSubscription(active || null);
            setUpcomingSubscription(upcoming || null);

        } catch (e) {
            console.error("Fetch sub error:", e);
        }
    };

    const fetchCoachPlans = async (cid) => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const url = cid
                ? `${API_BASE_URL}/v1/subscriptions/${cid}/plans`
                : `${API_BASE_URL}/v1/subscriptions/plans/all`;

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (res.data.success && res.data.data) {
                const dynamicPlans = res.data.data.map(p => ({
                    id: p.id,
                    name: p.plan_name,
                    price: p.price,
                    months: p.duration_days ? Math.round(p.duration_days / 30) : 1,
                    duration_days: p.duration_days,
                    features: Array.isArray(p.features) ? p.features : []
                }));
                setPlans(dynamicPlans);
            }
        } catch (e) {
            console.error("Fetch plans error:", e);
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };


    const handleSubscribe = async (plan) => {
        if (!user) {
            Alert.alert("Error", "Please login to subscribe");
            return;
        }

        if (!selectedCoachId) {
            Alert.alert("Selection Required", "Please first select a coach to subscribe to their plan.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/v1/subscriptions`, {
                coach_id: selectedCoachId,
                months: plan.months,
                amount: plan.price,
                plan_id: plan.id
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
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
                                {activeSubscription
                                    ? `₹${activeSubscription.plan_price || 0} • Expires on ${new Date(activeSubscription.end_date).toLocaleDateString()}`
                                    : 'Subscribe to unlock all features'}
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

                    {upcomingSubscription && (
                        <>
                            <Text style={styles.sectionTitle}>Upcoming Plan</Text>
                            <View style={styles.currentPlanCard}>
                                <View style={styles.planIconBox}>
                                    <Ionicons name="time" size={24} color="#FFD700" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.planName}>
                                        Upcoming Plan
                                    </Text>
                                    <Text style={styles.planExpiry}>
                                        {`₹${upcomingSubscription.plan_price || 0} • Starts on ${new Date(upcomingSubscription.start_date).toLocaleDateString()}`}
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}

                    {/* Coach Selection */}
                    <Text style={styles.sectionTitle}>Select Your Coach</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coachList}>
                        <TouchableOpacity
                            style={[styles.coachItem, !selectedCoachId && styles.selectedCoach]}
                            onPress={() => setSelectedCoachId(null)}
                        >
                            <View style={styles.coachAvatarPlaceholder}>
                                <Ionicons name="apps" size={24} color="#fff" />
                            </View>
                            <Text style={styles.coachName}>None</Text>
                        </TouchableOpacity>

                        {coaches.map((c) => (
                            <TouchableOpacity
                                key={c.id}
                                style={[styles.coachItem, selectedCoachId === c.user_id && styles.selectedCoach]}
                                onPress={() => setSelectedCoachId(c.user_id)}
                            >
                                <View style={styles.coachAvatarContainer}>
                                    {c.users?.profile_image ? (
                                        <Image source={{ uri: c.users.profile_image }} style={styles.coachAvatar} />
                                    ) : (
                                        <View style={styles.coachAvatarPlaceholder}>
                                            <Ionicons name="person" size={24} color="#fff" />
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.coachName} numberOfLines={1}>
                                    {c.users?.name?.split(' ')[0] || 'Coach'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

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
                                        <Text style={styles.perPeriod}>/{p.duration_days ? `${p.duration_days} days` : (p.id === 'monthly' ? 'month' : 'year')}</Text>
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

                    {/* Billing History */}
                    <Text style={styles.sectionTitle}>Billing History</Text>
                    <View style={styles.billingList}>
                        {history.length > 0 ? (
                            history.map((item) => (
                                <BillingItem
                                    key={item.id}
                                    title={item.plan?.plan_name || `Premium ${item.plan_type || 'Plan'}`}
                                    date={new Date(item.created_at).toLocaleDateString()}
                                    price={`₹${item.plan_price || 0}`}
                                />
                            ))
                        ) : (
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    billingTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    billingDate: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 2,
    },
    billingPrice: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    // Coach Selector Styles
    coachList: {
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    coachItem: {
        alignItems: 'center',
        marginRight: 20,
        padding: 5,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'transparent',
        width: 80,
    },
    selectedCoach: {
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255,215,0,0.1)',
    },
    coachAvatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 4,
    },
    coachAvatar: {
        width: '100%',
        height: '100%',
    },
    coachAvatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    coachName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
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
