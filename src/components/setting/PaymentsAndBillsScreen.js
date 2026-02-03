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

const PaymentsAndBillsScreen = ({ navigation }) => {
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
                    <View style={styles.coinIcon}>
                        <View style={styles.coinInner} />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Active Subscription */}
                    <Text style={styles.sectionTitle}>Active Subscription</Text>
                    <View style={styles.activePlanCard}>
                        <View style={styles.planIconWrapper}>
                            <Ionicons name="star" size={20} color="#FFD700" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.planName}>Premium Plan</Text>
                            <Text style={styles.planDetails}>Billed monthly • Next billing: Aug 15, 2024</Text>
                        </View>
                        <TouchableOpacity style={styles.manageButton}>
                            <Text style={styles.manageButtonText}>Manage</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Payment Methods */}
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Payment Methods</Text>
                        <TouchableOpacity>
                            <Text style={styles.addText}>+ Add New</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardItem}>
                        <View style={styles.cardIcon}>
                            <View style={{ width: 24, height: 16, backgroundColor: '#4a3b69', borderRadius: 2 }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardText}>Visa ending in 4242</Text>
                            <Text style={styles.cardExpiry}>Expires 08/2025</Text>
                        </View>
                        <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
                    </View>

                    <View style={[styles.cardItem, { opacity: 0.7 }]}>
                        <View style={styles.cardIcon}>
                            <View style={{ width: 24, height: 16, backgroundColor: '#4a3b69', borderRadius: 2 }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardText}>Mastercard ending in 8899</Text>
                            <Text style={styles.cardExpiry}>Expires 12/2024</Text>
                        </View>
                    </View>

                    {/* Transaction History */}
                    <Text style={styles.sectionTitle}>Transaction History</Text>
                    <View style={styles.historyList}>
                        <HistoryItem title="Monthly Subscription" date="July 15, 2024" amount="-$19.99" />
                        <HistoryItem title="Monthly Subscription" date="June 15, 2024" amount="-$19.99" />
                        <HistoryItem title="Coach Session" date="June 10, 2024" amount="-$45.00" />
                        <HistoryItem title="Monthly Subscription" date="May 15, 2024" amount="-$19.99" />
                    </View>

                </ScrollView>
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
            <Text style={styles.historyTitle}>{title}</Text>
            <Text style={styles.historyDate}>{date}</Text>
        </View>
        <Text style={styles.historyAmount}>{amount}</Text>
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
        color: '#4CC9F0', // Light blue accent
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
    planName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    planDetails: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        marginTop: 2,
    },
    manageButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    manageButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
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
        backgroundColor: '#332a45',
        borderRadius: 4,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    cardExpiry: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 2,
    },
    historyList: {
        marginTop: 5,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    historyIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    historyTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    historyDate: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 2,
    },
    historyAmount: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default PaymentsAndBillsScreen;
