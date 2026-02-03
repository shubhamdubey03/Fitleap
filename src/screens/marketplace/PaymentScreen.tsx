import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAYMENT_METHODS = [
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'netbanking', name: 'Net Banking' },
    { id: 'razorpay', name: 'Razorpay' },
    { id: 'paytm', name: 'Paytm' },
];

const PaymentScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [saveCard, setSaveCard] = useState(false);

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

                {selectedMethod === 'card' && (
                    <View style={styles.cardForm}>
                        <View style={styles.formGroup}>
                            <TextInput
                                placeholder="Card Number"
                                placeholderTextColor="#666"
                                style={styles.input}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <TextInput
                                placeholder="Expiry Date"
                                placeholderTextColor="#666"
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <TextInput
                                placeholder="CVV"
                                placeholderTextColor="#666"
                                style={styles.input}
                                secureTextEntry
                                keyboardType="numeric"
                                maxLength={3}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <TextInput
                                placeholder="Name on Card"
                                placeholderTextColor="#666"
                                style={styles.input}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setSaveCard(!saveCard)}
                        >
                            <Ionicons
                                name={saveCard ? "checkbox" : "square-outline"}
                                size={20}
                                color={saveCard ? "#7b1fa2" : "#ccc"}
                            />
                            <Text style={styles.checkboxLabel}>Save card details for future purchases</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => {
                        alert('Purchase Completed!');
                        navigation.navigate('MarketplaceHome');
                    }}
                >
                    <Text style={styles.checkoutBtnText}>Complete Purchase</Text>
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
});

export default PaymentScreen;
