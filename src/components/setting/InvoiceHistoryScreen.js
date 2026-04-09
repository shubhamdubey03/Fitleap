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
    Linking,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';

const InvoiceHistoryScreen = ({ navigation }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    const fetchInvoices = useCallback(async () => {
        try {
            setLoading(true);
            const token = user?.token || user?.access_token;
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/orders/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setInvoices(response.data);
            }
        } catch (error) {
            console.error('Fetch invoices error:', error);
            // Don't show Alert if it's just a 401 on login
        } finally {
            setLoading(false);
        }
    }, [user?.token, user?.access_token]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleDownload = (invoiceUrl) => {
        if (!invoiceUrl) {
            Alert.alert('Info', 'Invoice not available for this order.');
            return;
        }

        const fullUrl = invoiceUrl.startsWith('http')
            ? invoiceUrl
            : `${API_BASE_URL.replace('/api', '')}${invoiceUrl.startsWith('/') ? '' : '/'}${invoiceUrl}`;

        Linking.openURL(fullUrl).catch(err => {
            console.error("Couldn't open URL", err);
            Alert.alert('Error', 'Unable to open invoice link.');
        });
    };

    // Grouping logic with defensive checks
    const groupedInvoices = invoices.reduce((acc, inv) => {
        const year = inv.created_at ? new Date(inv.created_at).getFullYear() : 'Recent';
        if (!acc[year]) acc[year] = [];
        acc[year].push(inv);
        return acc;
    }, {});

    const sortedYears = Object.keys(groupedInvoices).sort((a, b) => {
        if (a === 'Recent') return -1;
        if (b === 'Recent') return 1;
        return Number(b) - Number(a);
    });

    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Invoice History</Text>
                    {/* Placeholder for layout balance - removed yellow button */}
                    <View style={{ width: 40 }} />
                </View>

                {loading && invoices.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {invoices.length === 0 ? (
                            <View style={styles.centerContainer}>
                                <Text style={styles.emptyText}>No invoices found</Text>
                            </View>
                        ) : (
                            sortedYears.map(year => (
                                <View key={year} style={styles.yearSection}>
                                    <Text style={styles.yearHeader}>{year}</Text>
                                    {groupedInvoices[year].map((item) => (
                                        <View key={item.id} style={styles.invoiceCard}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.invoiceDate}>
                                                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : 'N/A'}
                                                </Text>
                                                <Text style={styles.invoiceId}>ID: #{item.id?.toString().slice(0, 8).toUpperCase()}</Text>
                                                <Text style={styles.productName} numberOfLines={1}>
                                                    {item.products?.name || 'Order Item'}
                                                </Text>
                                            </View>
                                            <TouchableOpacity onPress={() => handleDownload(item.invoice_url)}>
                                                <Ionicons name="download-outline" size={24} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            ))
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </LinearGradient>
    );
};

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
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    yearSection: { marginBottom: 20 },
    yearHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 15,
        marginTop: 10,
    },
    invoiceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,0.08)',
        padding: 15,
        borderRadius: 12,
    },
    invoiceDate: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    invoiceId: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        marginBottom: 2,
    },
    productName: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 13,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        color: '#fff',
        fontSize: 16,
        opacity: 0.7,
    }
});

export default InvoiceHistoryScreen;
