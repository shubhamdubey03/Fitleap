import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const SubscriptionScreen = ({ navigation }) => {
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
                    <Text style={styles.headerTitle}>Subscriptions</Text>
                    <View style={styles.coinIcon}>
                        {/* Abstract representation of the coin icon from screenshot */}
                        <View style={styles.coinInner} />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Current Plan */}
                    <Text style={styles.sectionTitle}>Current Plan</Text>
                    <View style={styles.currentPlanCard}>
                        <View style={styles.planIconBox}>
                            <Ionicons name="star-outline" size={24} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.planName}>Premium</Text>
                            <Text style={styles.planExpiry}>Expires on July 15, 2024</Text>
                        </View>
                    </View>

                    {/* Upgrade Your Plan */}
                    <Text style={styles.sectionTitle}>Upgrade Your Plan</Text>

                    {/* Monthly Plan */}
                    <View style={styles.upgradeCard}>
                        <View style={styles.upgradeHeader}>
                            <Text style={styles.upgradeType}>Monthly</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>$19.99</Text>
                                <Text style={styles.perPeriod}>/month</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.selectButton}>
                            <Text style={styles.selectButtonText}>Select</Text>
                        </TouchableOpacity>

                        <View style={styles.featureList}>
                            <FeatureItem text="Access to all workouts" />
                            <FeatureItem text="Personalized nutrition plans" />
                            <FeatureItem text="Habit tracking" />
                            <FeatureItem text="Coaching support" />
                        </View>
                    </View>

                    {/* Yearly Plan */}
                    <View style={[styles.upgradeCard]}>
                        <View style={styles.upgradeHeader}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Text style={styles.upgradeType}>Yearly</Text>
                                <View style={styles.saveBadge}>
                                    <Text style={styles.saveText}>Save 37%</Text>
                                </View>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>$149.99</Text>
                                <Text style={styles.perPeriod}>/year</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.selectButton}>
                            <Text style={styles.selectButtonText}>Select</Text>
                        </TouchableOpacity>

                        <View style={styles.featureList}>
                            <FeatureItem text="Access to all workouts" />
                            <FeatureItem text="Personalized nutrition plans" />
                            <FeatureItem text="Habit tracking" />
                            <FeatureItem text="Coaching support" />
                        </View>
                    </View>

                    {/* Payment Method */}
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.paymentRow}>
                        <View style={styles.cardIcon}>
                            <View style={{ width: 24, height: 16, backgroundColor: '#4a3b69', borderRadius: 2 }} />
                        </View>
                        <View>
                            <Text style={styles.paymentText}>Visa ... 4242</Text>
                            <Text style={styles.paymentExpiry}>Expires 08/2025</Text>
                        </View>
                    </View>

                    {/* Billing History */}
                    <Text style={styles.sectionTitle}>Billing History</Text>
                    <View style={styles.billingList}>
                        <BillingItem title="Premium Subscription" date="July 1, 2024" price="$19.99" />
                        <BillingItem title="Premium Subscription" date="June 1, 2024" price="$19.99" />
                        <BillingItem title="Premium Subscription" date="May 1, 2024" price="$19.99" />
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
});

export default SubscriptionScreen;
