import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { AUTH_URL } from '../config/api';
import { logout, setUser } from '../redux/authSlice';

const ProfileScreen = ({ hideBack }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // Initial state from Redux (fallback)
    const { user } = useSelector((state) => state.auth);

    // Local state for fresh data
    const [userProfile, setUserProfile] = useState(user);

    // Sync local state with Redux when user changes
    useEffect(() => {
        if (user) {
            setUserProfile(user);
        }
    }, [user]);

    const getProfile = async () => {
        try {
            let token = await AsyncStorage.getItem('authToken');

            if (!token) {
                const userStr = await AsyncStorage.getItem('user');
                if (userStr) {
                    const userObj = JSON.parse(userStr);
                    token = userObj?.token;
                }
            }

            if (!token) return;

            const response = await axios.get(`${AUTH_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const freshData = response.data;
            setUserProfile(freshData);

            // Update Redux state (merge to keep token)
            if (user) {
                dispatch(setUser({ ...user, ...freshData }));
            }

        } catch (error) {
            console.log("Profile Fetch Error:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getProfile();
        }, [])
    );

    const handleLogout = async () => {
        try {
            dispatch(logout());

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });

        } catch (e) {
            console.log('Logout error:', e);

            await AsyncStorage.clear();

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={styles.container}
        >
            <View style={styles.header}>
                {!hideBack ? (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40 }} />
                )}
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
                        <Ionicons name="create-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: userProfile?.profile_image || 'https://i.pravatar.cc/150?img=3' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{userProfile?.name || 'User'}</Text>
                    <Text style={styles.phone}>{userProfile?.phone || userProfile?.email || 'No contact info'}</Text>
                </View>

                {/* Personal Details */}
                <ProfileItem icon="person-outline" label="Age" value={userProfile?.age ? `${userProfile.age} Years` : 'N/A'} />
                <ProfileItem icon="male-female-outline" label="Gender" value={userProfile?.gender || 'N/A'} />

                {/* Dynamic Height and Weight from DB */}
                <ProfileItem icon="resize-outline" label="Height" value={userProfile?.height ? `${userProfile.height} cm` : 'N/A'} />
                <ProfileItem icon="barbell-outline" label="Weight" value={userProfile?.weight ? `${userProfile.weight} Kg` : 'N/A'} />

                {/* Calculated Metrics */}
                <Text style={styles.sectionTitle}>Calculated Metrics</Text>

                {(() => {
                    const weight = parseFloat(userProfile?.weight);
                    const height = parseFloat(userProfile?.height);
                    const age = parseInt(userProfile?.age);
                    const gender = userProfile?.gender?.toLowerCase();

                    if (!weight || !height || !age) {
                        return (
                            <>
                                <ProfileItem icon="calculator-outline" label="BMI" value="N/A" />
                                <ProfileItem icon="flame-outline" label="BMR" value="N/A" />
                                <ProfileItem icon="pulse-outline" label="TDEE" value="N/A" />
                            </>
                        );
                    }

                    // BMI = weight (kg) / (height in meter * height in meter)
                    const heightInMeter = height / 100;
                    const bmi = (weight / (heightInMeter * heightInMeter)).toFixed(1);

                    // BMR = 10 × weight + 6.25 × height − 5 × age + 5 (male)
                    // BMR = 10 × weight + 6.25 × height − 5 × age − 161 (female)
                    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
                    if (gender === 'female' || gender === 'f') {
                        bmr -= 161;
                    } else {
                        bmr += 5;
                    }

                    // TDEE = BMR × Activity Level
                    const multipliers = {
                        'Sedentary': 1.2,
                        'Light': 1.375,
                        'Moderate': 1.55,
                        'Heavy': 1.725
                    };
                    const multiplier = multipliers[userProfile?.activity_level] || 1.55;
                    const tdee = Math.round(bmr * multiplier);

                    return (
                        <>
                            <ProfileItem icon="analytics-outline" label="Activity" value={userProfile?.activity_level || 'Moderate'} />
                            <ProfileItem icon="calculator-outline" label="BMI" value={bmi} />
                            <ProfileItem icon="flame-outline" label="BMR" value={`${Math.round(bmr)} Kcal`} />
                            <ProfileItem icon="pulse-outline" label="TDEE" value={`${tdee} Kcal`} />
                        </>
                    );
                })()}

                <TouchableOpacity
                    style={[styles.logoutBtn, { backgroundColor: 'rgba(255,107,61,0.1)', borderColor: '#FF6B3D', marginTop: 20 }]}
                    onPress={() => navigation.navigate('InviteFriend')}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="people-outline" size={20} color="#FF6B3D" style={{ marginRight: 10 }} />
                        <Text style={[styles.logoutText, { color: '#FF6B3D' }]}>Invite Friends & Earn</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

const ProfileItem = ({ icon, label, value }) => (
    <View style={styles.item}>
        <View style={styles.itemLeft}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={18} color="#fff" />
            </View>
            <Text style={styles.itemText}>
                {label} : {value}
            </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#aaa" />
    </View>
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
