import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator,
    Modal,
    FlatList,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const ShippingScreen = ({ navigation, route }: { navigation: any, route: any }) => {
    const insets = useSafeAreaInsets();
    const { totalAmount, items } = route.params || {};
    const user = useSelector((state: any) => state.auth.user);

    // Data State
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<any>(null); // If editing
    const [saveAddress, setSaveAddress] = useState(true);

    // Form Fields
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [addressType, setAddressType] = useState('Home');

    // Location Data for Form
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [selectedState, setSelectedState] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectionType, setSelectionType] = useState('');

    useEffect(() => {
        console.log("user", user)
        if (user?._id) {
            fetchAddresses();
        } else {
            setInitialLoading(false);
        }
    }, [user]);


    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/orders/address`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log('respone', response)
            if (Array.isArray(response.data)) {
                setAddresses(response.data);
                if (response.data.length > 0 && !selectedAddressId) {
                    setSelectedAddressId(response.data[0].id);
                    console.log("iiiiieeee", response.data)
                } else if (response.data.length === 0) {
                    handleOpenForm(); // Auto show form and fetch countries if no address
                }
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/countries`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (Array.isArray(response.data)) {
                setCountries(response.data);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };
    console.log("---", user.token)

    const fetchStates = async (countryId: any) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/states/${countryId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStates(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching states:', error);
            return [];
        }
    };

    const handleOpenForm = async (existingAddress?: any) => {
        await fetchCountries();

        if (existingAddress) {
            setEditingAddressId(existingAddress.id);
            setName(existingAddress.name);
            setMobile(existingAddress.mobile_number);
            setAddress1(existingAddress.address1);
            setAddress2(existingAddress.address2 || '');
            setCity(existingAddress.city);
            setPincode(existingAddress.pincode);
            setAddressType(existingAddress.address_type ? (existingAddress.address_type.charAt(0).toUpperCase() + existingAddress.address_type.slice(1)) : 'Home');

            // Note: State/Country pre-selection logic would go here if we had full relation mapping
            if (existingAddress.state_id) {
                // Ideally prompt user to re-select or fetch implementation details
            }
        } else {
            setEditingAddressId(null);
            setName('');
            setMobile('');
            setAddress1('');
            setAddress2('');
            setCity('');
            setPincode('');
            setAddressType('Home');
            setSelectedState(null);
            setSelectedCountry(null);
        }
        setShowForm(true);
    };

    const handleDeleteAddress = async (id: any) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this address?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const config = { headers: { Authorization: `Bearer ${user.token}` } };
                            await axios.delete(`${API_BASE_URL}/orders/address/${id}`, config);
                            if (selectedAddressId === id) setSelectedAddressId(null);
                            fetchAddresses();
                        } catch (error) {
                            console.error("Failed to delete address:", error);
                            Alert.alert("Error", "Failed to delete address.");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleAddressOptions = (item: any) => {
        Alert.alert(
            "Address Options",
            "Choose an action for this address",
            [
                { text: "Edit", onPress: () => handleOpenForm(item) },
                { text: "Delete", onPress: () => handleDeleteAddress(item.id), style: "destructive" },
                { text: "Cancel", style: "cancel" }
            ],
            { cancelable: true }
        );
    };

    const handleSaveAddress = async () => {
        if (!name || !mobile || !address1 || !city || !pincode || !selectedState) {
            Alert.alert("Error", "Please fill all required fields.");
            return;
        }

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
            Alert.alert("Invalid Name", "Name must only contain letters and spaces.");
            return;
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            Alert.alert("Invalid Mobile", "Mobile number must be exactly 10 digits.");
            return;
        }

        const pincodeRegex = /^[0-9]{6}$/;
        if (!pincodeRegex.test(pincode)) {
            Alert.alert("Invalid Pincode", "Pincode must be exactly 6 digits.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                id: editingAddressId,
                user_id: user.id || user._id,
                name,
                mobile_number: mobile,
                address1,
                address2,
                city,
                state_id: selectedState.id,
                pincode,
                address_type: addressType.toLowerCase()
            };

            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            if (editingAddressId) {
                await axios.put(`${API_BASE_URL}/orders/address/${editingAddressId}`, payload, config);
            } else {
                await axios.post(`${API_BASE_URL}/orders/address`, payload, config);
            }

            setShowForm(false);
            fetchAddresses(); // Refresh list

        } catch (error) {
            console.error("Failed to save address:", error);
            Alert.alert("Error", "Failed to save address.");
        } finally {
            setLoading(false);
        }
    };

    const handleProceed = () => {
        if (!selectedAddressId) {
            Alert.alert("Error", "Please select an address.");
            return;
        }
        const selectedAddr = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddr) return;

        navigation.navigate('Payment', {
            totalAmount,
            items,
            address_id: selectedAddressId,
            shippingDetails: {
                name: selectedAddr.name,
                phone: selectedAddr.mobile_number,
                address: `${selectedAddr.address1}, ${selectedAddr.address2 ? selectedAddr.address2 + ', ' : ''}${selectedAddr.city}, ${selectedAddr.pincode}`
            }
        });
    };

    // --- Render Helpers ---

    const renderSelectionItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                if (selectionType === 'country') {
                    setSelectedCountry(item);
                    fetchStates(item.id);
                } else {
                    setSelectedState(item);
                }
                setModalVisible(false);
            }}
        >
            <Text style={styles.modalItemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderAddressItem = ({ item }: { item: any }) => {
        const isSelected = item.id === selectedAddressId;
        return (
            <TouchableOpacity
                style={[styles.addressCard, isSelected && styles.addressCardSelected]}
                onPress={() => setSelectedAddressId(item.id)}
                activeOpacity={0.9}
            >
                {/* Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.cardIconBox}>
                        <Ionicons
                            name={item.address_type?.toLowerCase() === 'work' ? "briefcase" : "home"}
                            size={20}
                            color="#B8860B"
                        />
                    </View>
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.cardTitle}>{item.address_type ? (item.address_type.charAt(0).toUpperCase() + item.address_type.slice(1)) : 'Home'}</Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.cardBody}>
                    <Text style={styles.cardBodyText}>
                        {item.name}, {item.address1}{item.address2 ? `, ${item.address2}` : ''}, {item.city}
                        {'\n'}{item.states?.name ? item.states.name : ''} {item.pincode}
                    </Text>
                    <Text style={styles.cardPhone}>Phone number: {item.mobile_number}</Text>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.cardActionBtn} onPress={() => handleAddressOptions(item)}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#7b1fa2" />
                    </TouchableOpacity>
                </View>

                {isSelected && (
                    <View style={styles.selectedCheck}>
                        <Ionicons name="checkmark-circle" size={24} color="#7b1fa2" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (initialLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#7b1fa2" />
            </View>
        );
    }

    // --- Main Render ---

    return (
        <LinearGradient
            colors={['#1a0033', '#3a005f']} // Dark purple gradient
            style={[styles.container, { paddingTop: insets.top }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => showForm ? setShowForm(false) : navigation.goBack()}>
                    <View style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{showForm ? (editingAddressId ? 'Edit Address' : 'Add Address') : 'Select delivery location'}</Text>
                <View style={{ width: 36 }} />
            </View>

            {showForm ? (
                // --- FORM VIEW ---
                <ScrollView contentContainerStyle={styles.formScroll}>
                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#aaa" />
                    </View>

                    {/* Mobile */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile Number *</Text>
                        <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" maxLength={10} placeholder="10-digit number" placeholderTextColor="#aaa" />
                    </View>

                    {/* Address 1 */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address Line 1 *</Text>
                        <TextInput style={styles.input} value={address1} onChangeText={setAddress1} placeholder="House No, Building" placeholderTextColor="#aaa" />
                    </View>

                    {/* Address 2 */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address Line 2 (Optional)</Text>
                        <TextInput style={styles.input} value={address2} onChangeText={setAddress2} placeholder="Area, Landmark" placeholderTextColor="#aaa" />
                    </View>

                    {/* City & Pincode */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>City *</Text>
                            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" placeholderTextColor="#aaa" />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Pincode *</Text>
                            <TextInput style={styles.input} value={pincode} onChangeText={setPincode} keyboardType="numeric" maxLength={6} placeholder="Zip Code" placeholderTextColor="#aaa" />
                        </View>
                    </View>

                    {/* Country & State */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Country *</Text>
                            <TouchableOpacity style={styles.selector} onPress={() => { setSelectionType('country'); setModalVisible(true); }}>
                                <Text style={{ color: selectedCountry ? '#fff' : '#aaa' }}>{selectedCountry ? selectedCountry.name : 'Select'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>State *</Text>
                            <TouchableOpacity style={styles.selector} onPress={() => {
                                if (!selectedCountry) Alert.alert("First select country");
                                else { setSelectionType('state'); setModalVisible(true); }
                            }}>
                                <Text style={{ color: selectedState ? '#fff' : '#aaa' }}>{selectedState ? selectedState.name : 'Select'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Address Type */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address Type</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {['Home', 'Work', 'Other'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.typeChip, addressType === type && styles.typeChipActive]}
                                    onPress={() => setAddressType(type)}
                                >
                                    <Text style={[styles.typeText, addressType === type && styles.typeTextActive]}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAddress} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Address</Text>}
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                // --- LIST VIEW ---
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.listContent}>

                        {/* Actions */}
                        <TouchableOpacity style={styles.actionRow} onPress={() => handleOpenForm()}>
                            <View style={styles.actionIcon}>
                                <Ionicons name="add" size={24} color="#4CAF50" />
                            </View>
                            <Text style={[styles.actionText, { color: '#4CAF50' }]}>Add new address</Text>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>

                        <Text style={styles.sectionHeader}>Your saved addresses</Text>

                        {addresses.map((item) => (
                            <View key={item.id}>
                                {renderAddressItem({ item })}
                            </View>
                        ))}


                    </ScrollView>

                    {/* {addresses.length > 0 && ( */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
                            <Text style={styles.proceedBtnText}>Proceed to Payment</Text>
                        </TouchableOpacity>
                    </View>
                    {/* )} */}
                </View>
            )}

            {/* Modal for Country/State */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select {selectionType === 'country' ? 'Country' : 'State'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={selectionType === 'country' ? countries : states}
                            keyExtractor={(item: any) => item.id.toString()}
                            renderItem={renderSelectionItem}
                        />
                    </View>
                </View>
            </Modal>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        // backgroundColor: 'transparent',
    },
    iconButton: {
        width: 36,
        height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },

    // List Styles
    listContent: { padding: 15, paddingBottom: 100 },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
    },
    actionIcon: {
        width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 15
    },
    actionText: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
    sectionHeader: { fontSize: 14, color: '#ccc', marginVertical: 15, marginLeft: 5 },

    // Address Card
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 0,
    },
    addressCardSelected: {
        borderWidth: 2,
        borderColor: '#7b1fa2',
        backgroundColor: '#fff', // Keep white background but add border
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    cardIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee'
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    cardDistance: {
        fontSize: 14,
        color: '#009688', // Teal
        marginLeft: 8,
        fontWeight: '500'
    },
    cardBody: {
        marginBottom: 12
    },
    cardBodyText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        marginBottom: 4
    },
    cardPhone: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500'
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    cardActionBtn: {
        marginRight: 16,
        padding: 4
    },
    selectedCheck: {
        position: 'absolute',
        top: 10,
        right: 10
    },

    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 15, backgroundColor: 'transparent'
    },
    proceedBtn: {
        backgroundColor: '#7b1fa2', padding: 15, borderRadius: 12, alignItems: 'center'
    },
    proceedBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    // Form Styles
    formScroll: { padding: 20 },
    inputGroup: { marginBottom: 15 },
    label: { marginBottom: 5, color: '#fff', fontWeight: '500' },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0, borderRadius: 10,
        padding: 12, color: '#fff'
    },
    selector: {
        backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0, borderRadius: 10,
        padding: 12, alignItems: 'center'
    },
    typeChip: {
        paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    typeChipActive: { backgroundColor: '#7b1fa2', borderColor: '#7b1fa2' },
    typeText: { color: '#ccc' },
    typeTextActive: { color: '#fff' },
    saveBtn: {
        backgroundColor: '#7b1fa2', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20
    },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '70%', padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#eee' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderColor: '#f0f0f0' },
    modalItemText: { fontSize: 16, color: '#333' }
});

export default ShippingScreen;
