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

const YourCoinsScreen = ({ navigation }) => {
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
                    <Text style={styles.headerTitle}>Your Coins</Text>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Total Coins Card */}
                    <View style={styles.totalCoinsCard}>
                        <Text style={styles.totalCoinsValue}>1,250</Text>
                        <Text style={styles.totalCoinsLabel}>Total Coins</Text>
                    </View>

                    {/* Coin Breakdown */}
                    <Text style={styles.sectionTitle}>Coin Breakdown</Text>
                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Bonus Coins</Text>
                        <Text style={styles.breakdownValue}>500</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Earned Coins</Text>
                        <Text style={styles.breakdownValue}>750</Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity style={styles.earnButton}>
                            <Text style={styles.earnButtonText}>Earn Coins</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.redeemButton}>
                            <Text style={styles.redeemButtonText}>Redeem Coins</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Transaction History */}
                    <Text style={styles.sectionTitle}>Transaction History</Text>
                    <View style={styles.historyList}>
                        <HistoryItem
                            icon="gift-outline"
                            title="Daily Streak Bonus"
                            subtitle="Bonus Coins"
                            amount="+100"
                        />
                        <HistoryItem
                            icon="barbell-outline"
                            title="Completed Workout"
                            subtitle="Earned Coins"
                            amount="+50"
                        />
                        <HistoryItem
                            icon="nutrition-outline"
                            title="Completed Nutrition Goal"
                            subtitle="Earned Coins"
                            amount="+50"
                        />
                        <HistoryItem
                            icon="people-outline"
                            title="Referral Bonus"
                            subtitle="Bonus Coins"
                            amount="+200"
                        />
                        <HistoryItem
                            icon="checkbox-outline"
                            title="Completed Habit"
                            subtitle="Earned Coins"
                            amount="+50"
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const HistoryItem = ({ icon, title, subtitle, amount }) => (
    <View style={styles.historyItem}>
        <View style={styles.historyIcon}>
            <Ionicons name={icon} size={20} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.historyTitle}>{title}</Text>
            <Text style={styles.historySubtitle}>{subtitle}</Text>
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
    settingsButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'serif',
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    totalCoinsCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        marginTop: 10,
        marginBottom: 30,
    },
    totalCoinsValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    totalCoinsLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    breakdownLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    breakdownValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    actionButtonsContainer: {
        marginTop: 20,
        marginBottom: 40,
        alignItems: 'center',
    },
    earnButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '60%',
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 15,
    },
    earnButtonText: {
        color: '#3b0a57',
        fontWeight: 'bold',
        fontSize: 14,
    },
    redeemButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        width: '60%',
        paddingVertical: 12,
        alignItems: 'center',
    },
    redeemButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    historyList: {
        marginBottom: 20,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: 12,
    },
    historyIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    historyTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    historySubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    historyAmount: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default YourCoinsScreen;
