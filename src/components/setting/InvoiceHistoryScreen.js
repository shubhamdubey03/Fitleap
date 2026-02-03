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

const InvoiceHistoryScreen = ({ navigation }) => {
    const invoices = [
        { date: 'July 26, 2024', id: 'Invoice #20240726-001' },
        { date: 'June 26, 2024', id: 'Invoice #20240626-001' },
        { date: 'May 26, 2024', id: 'Invoice #20240526-001' },
        { date: 'April 26, 2024', id: 'Invoice #20240426-001' },
        { date: 'March 26, 2024', id: 'Invoice #20240326-001' },
        { date: 'February 26, 2024', id: 'Invoice #20240226-001' },
        { date: 'January 28, 2024', id: 'Invoice #20240128-001' },
    ];

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
                    <Text style={styles.headerTitle}>Invoice History</Text>
                    <View style={styles.coinIcon}>
                        <View style={styles.coinInner} />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.yearHeader}>2024</Text>

                    <View style={styles.invoiceList}>
                        {invoices.map((invoice, index) => (
                            <View key={index} style={styles.invoiceItem}>
                                <View>
                                    <Text style={styles.invoiceDate}>{invoice.date}</Text>
                                    <Text style={styles.invoiceId}>{invoice.id}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Ionicons name="download-outline" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

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
        marginTop: 50, // Match Subscription layout
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
    yearHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
    },
    invoiceList: {
        marginTop: 10,
    },
    invoiceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    invoiceDate: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    invoiceId: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
    }
});

export default InvoiceHistoryScreen;
