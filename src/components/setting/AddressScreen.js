import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddressScreen = ({ navigation }) => {
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        loadAddress();
    }, []);

    const loadAddress = async () => {
        try {
            const savedAddress = await AsyncStorage.getItem('USER_ADDRESS');
            if (savedAddress) {
                const parsedAddress = JSON.parse(savedAddress);
                setStreet(parsedAddress.street || '');
                setCity(parsedAddress.city || '');
                setState(parsedAddress.state || '');
                setZipCode(parsedAddress.zipCode || '');
                setCountry(parsedAddress.country || '');
            }
        } catch (error) {
            console.error('Failed to load address:', error);
            Alert.alert('Error', 'Failed to load saved address');
        }
    };

    const handleSave = async () => {
        if (!street || !city || !state || !zipCode || !country) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const addressData = {
            street,
            city,
            state,
            zipCode,
            country,
        };

        try {
            // Save as current active address
            await AsyncStorage.setItem('USER_ADDRESS', JSON.stringify(addressData));

            // Append to history list
            const storedAddresses = await AsyncStorage.getItem('USER_ADDRESSES');
            let addresses = [];
            if (storedAddresses) {
                addresses = JSON.parse(storedAddresses);
            }

            // Avoid duplicates (simple check based on strict equality of JSON strings or specific fields could be better, but basic append is requested)
            // Check if address already exists
            const isDuplicate = addresses.some(addr =>
                addr.street === addressData.street &&
                addr.zipCode === addressData.zipCode
            );

            if (!isDuplicate) {
                addresses.push(addressData);
                await AsyncStorage.setItem('USER_ADDRESSES', JSON.stringify(addresses));
            }

            Alert.alert('Success', 'Address saved successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to save address:', error);
            Alert.alert('Error', 'Failed to save address');
        }
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3b0a57', '#6a0f6b']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Address</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Street Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123 Main St"
                            placeholderTextColor="#aaa"
                            value={street}
                            onChangeText={setStreet}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="New York"
                            placeholderTextColor="#aaa"
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>State</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="NY"
                                placeholderTextColor="#aaa"
                                value={state}
                                onChangeText={setState}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Zip Code</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="10001"
                                placeholderTextColor="#aaa"
                                keyboardType="numeric"
                                value={zipCode}
                                onChangeText={setZipCode}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Country</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="United States"
                            placeholderTextColor="#aaa"
                            value={country}
                            onChangeText={setCountry}
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Address</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    content: {
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 4
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#FF6B3D',
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        shadowColor: "#FF6B3D",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddressScreen;
