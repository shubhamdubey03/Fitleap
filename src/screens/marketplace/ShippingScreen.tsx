import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ShippingScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [saveAddress, setSaveAddress] = React.useState(true);

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
                <Text style={styles.headerTitle}>Shipping</Text>
                <TouchableOpacity>
                    <View style={styles.iconButton}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        placeholder="Enter your full name"
                        placeholderTextColor="#666"
                        style={styles.input}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Street Address</Text>
                    <TextInput
                        placeholder="Enter your street address"
                        placeholderTextColor="#666"
                        style={styles.input}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                        placeholder="Enter your city"
                        placeholderTextColor="#666"
                        style={styles.input}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>State</Text>
                    <TextInput
                        placeholder="Enter your state"
                        placeholderTextColor="#666"
                        style={styles.input}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Zip Code</Text>
                    <TextInput
                        placeholder="Enter your zip code"
                        placeholderTextColor="#666"
                        style={styles.input}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput
                        placeholder="Enter your contact number"
                        placeholderTextColor="#666"
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.saveRow}>
                    <Text style={styles.saveLabel}>Save this address for future use</Text>
                    <Switch
                        value={saveAddress}
                        onValueChange={setSaveAddress}
                        trackColor={{ false: "#767577", true: "#7b1fa2" }}
                        thumbColor={saveAddress ? "#f4f3f4" : "#f4f3f4"}
                    />
                </View>

                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => navigation.navigate('Payment')}
                >
                    <Text style={styles.checkoutBtnText}>Proceed To Checkout</Text>
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
    formGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        fontSize: 16,
    },
    saveRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    saveLabel: {
        color: '#ccc',
        fontSize: 14,
    },
    checkoutBtn: {
        backgroundColor: '#7b1fa2', // Purple accent
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkoutBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ShippingScreen;
