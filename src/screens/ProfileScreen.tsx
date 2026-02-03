import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const ProfileScreen = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await AsyncStorage.setItem('IS_LOGGED_IN', 'false');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (e) {
            console.log('Logout error:', e);
        }
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconBtn}>
                    <Ionicons name="settings-outline" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>Sophia</Text>
                    <Text style={styles.phone}>+1-555-123-4567</Text>
                </View>

                {/* Personal Details */}
                <ProfileItem icon="time-outline" label="Age" value="28" />
                <ProfileItem icon="female-outline" label="Gender" value="Female" />
                <ProfileItem icon="resize-outline" label="Height" value="5'6" />
                <ProfileItem icon="barbell-outline" label="Weight" value="65 Kg" />

                {/* Calculated Metrics */}
                <Text style={styles.sectionTitle}>Calculated Metrics</Text>

                <ProfileItem icon="calculator-outline" label="BMI" value="22.5" />
                <ProfileItem icon="flame-outline" label="BMR" value="1400 Kcal" />
                <ProfileItem icon="pulse-outline" label="TGEE" value="1800 Kcal" />

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const ProfileItem = ({ icon, label, value }) => (
    <TouchableOpacity style={styles.item}>
        <View style={styles.itemLeft}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={18} color="#fff" />
            </View>
            <Text style={styles.itemText}>
                {label} : {value}
            </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#aaa" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    iconBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        marginBottom: 15,
    },
    name: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    phone: {
        color: '#ccc',
        fontSize: 14,
    },
    item: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
    },
    logoutBtn: {
        backgroundColor: '#1a0033', // Darker background as per screenshot
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProfileScreen;
