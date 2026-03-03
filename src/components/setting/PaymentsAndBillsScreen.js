import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL, API_V1_URL } from '../../config/api';

const PaymentsAndBillsScreen = ({ navigation }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector(state => state.auth);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = user?.token || user?.access_token;
            if (!token) return;

            const [subRes, transRes] = await Promise.all([
                axios.get(`${API_V1_URL}/subscriptions`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_BASE_URL}/orders/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setSubscriptions(subRes.data || []);
            setTransactions(transRes.data || []);
        } catch (error) {
            console.error('Fetch payments data error:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const activeSub = subscriptions.find(s => s.status === 'active');

    return (
        <LinearGradient
            colors={['#1a0033', '#3b0a57', '#6a0f6b']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Payments & Bills</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                        {/* Active Subscription */}
                        <Text style={styles.sectionTitle}>Active Subscription</Text>
                        {activeSub ? (
                            <View style={styles.activePlanCard}>
                                <View style={styles.planIconWrapper}>
                                    <Ionicons name="star" size={20} color="#FFD700" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.planName}>{activeSub.coach?.name ? `${activeSub.coach.name}'s Coaching` : 'Premium Plan'}</Text>
                                    <Text style={styles.planDetails}>
                                        Ends: {new Date(activeSub.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.manageButton}
                                    onPress={() => navigation.navigate('SubscriptionScreen')}
                                >
                                    <Text style={styles.manageButtonText}>Manage</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyText}>No active subscription found.</Text>
                                <TouchableOpacity
                                    style={styles.subscribeBtn}
                                    onPress={() => navigation.navigate('Consultation', { screen: 'Coaching' })}
                                >
                                    <Text style={styles.subscribeBtnText}>Explore Plans</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Payment Methods - Placeholder as No Backend Yet */}
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Payment Methods</Text>
                            <TouchableOpacity onPress={() => Alert.alert('Info', 'New payment methods can be added during checkout.')}>
                                <Text style={styles.addText}>+ Add New</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.cardItem}>
                            <View style={styles.cardIcon}>
                                <Ionicons name="card-outline" size={20} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cardText}>Stored via Razorpay</Text>
                                <Text style={styles.cardExpiry}>Securely managed</Text>
                            </View>
                            <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
                        </View>

                        {/* Transaction History */}
                        <Text style={styles.sectionTitle}>Transaction History</Text>
                        <View style={styles.historyList}>
                            {transactions.length > 0 ? (
                                transactions.map((item) => (
                                    <HistoryItem
                                        key={item.id}
                                        title={item.products?.name || 'Order Item'}
                                        date={new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        amount={`-₹${item.total_price}`}
                                    />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No recent transactions found.</Text>
                            )}
                        </View>

                    </ScrollView>
                )}
            </SafeAreaView>
        </LinearGradient>
    );
};

const HistoryItem = ({ title, date, amount }) => (
    <View style={styles.historyItem}>
        <View style={styles.historyIcon}>
            <Ionicons name="receipt-outline" size={18} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.historyTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.historyDate}>{date}</Text>
        </View>
        <Text style={styles.historyAmount}>{amount}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 50,
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
        fontFamily: 'serif',
    },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        marginTop: 10,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    addText: {
        color: '#4CC9F0',
        fontSize: 14,
        fontWeight: '600',
    },
    activePlanCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    planIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    planName: { color: '#fff', fontSize: 15, fontWeight: '600' },
    planDetails: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
    manageButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    manageButtonText: { color: '#fff', fontSize: 12, fontWeight: '500' },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    cardIcon: {
        width: 40,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardText: { color: '#fff', fontSize: 15, fontWeight: '500', opacity: 0.9 },
    cardExpiry: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
    historyList: { marginTop: 5 },
    historyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    historyIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    historyTitle: { color: '#fff', fontSize: 14, fontWeight: '500' },
    historyDate: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
    historyAmount: { color: '#fff', fontSize: 14, fontWeight: '600' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
    emptyCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 25,
    },
    emptyText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center' },
    subscribeBtn: {
        marginTop: 15,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    subscribeBtnText: { color: '#3b0a57', fontWeight: 'bold' },
});

export default PaymentsAndBillsScreen;
