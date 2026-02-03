import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const SavedAddressesScreen = ({ navigation }) => {
    const [addresses, setAddresses] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadAddresses();
        }, [])
    );

    const loadAddresses = async () => {
        try {
            const storedAddresses = await AsyncStorage.getItem('USER_ADDRESSES');
            if (storedAddresses) {
                setAddresses(JSON.parse(storedAddresses));
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
        }
    };

    const handleSelectAddress = async (selectedAddress) => {
        try {
            // Set as the active address for the order
            await AsyncStorage.setItem('USER_ADDRESS', JSON.stringify(selectedAddress));
            navigation.goBack();
        } catch (error) {
            console.error('Failed to set address:', error);
            Alert.alert('Error', 'Failed to select address');
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.addressCard}
            onPress={() => handleSelectAddress(item)}
        >
            <View style={styles.addressInfo}>
                <Ionicons name="location-outline" size={24} color="#FF6B3D" style={styles.icon} />
                <View style={styles.textContainer}>
                    <Text style={styles.addressText}>
                        {item.street}, {item.city}
                    </Text>
                    <Text style={styles.subText}>
                        {item.state} {item.zipCode}, {item.country}
                    </Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#1a0033', '#3b0a57', '#6a0f6b']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Address</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddressScreen')}>
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={addresses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No saved addresses found.</Text>
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => navigation.navigate('AddressScreen')}
                        >
                            <Text style={styles.addBtnText}>Add New Address</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
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
        justifyContent: 'space-between',
        marginBottom: 20,
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
    listContent: {
        paddingBottom: 40,
    },
    addressCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
    },
    addressText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    subText: {
        color: '#ccc',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#ccc',
        fontSize: 16,
        marginBottom: 20,
    },
    addBtn: {
        backgroundColor: '#FF6B3D',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default SavedAddressesScreen;
