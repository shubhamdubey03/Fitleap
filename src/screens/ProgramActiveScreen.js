import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useSelector } from 'react-redux';

const ProgramActiveScreen = ({ route, navigation }) => {
    const { program } = route.params;
    const user = useSelector((state) => state.auth.user);
    const token = user?.token || user?.access_token;

    const handleComplete = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/pc/complete`,
                { pc_id: program.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', `Completed! You earned ${response.data.reward} coins. 🎉`, [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Complete Error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to complete.');
        }
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Active Program</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                    style={styles.image}
                />

                <Text style={styles.title}>{program.title}</Text>
                <Text style={styles.description}>{program.description}</Text>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={20} color="#FFD700" />
                        <Text style={styles.infoText}>{program.duration_days} Days</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
                        <Text style={styles.infoText}>{program.reward_coins} Coins</Text>
                    </View>
                </View>

                {program.user_enrollment_status === 'completed' ? (
                    <View style={styles.statusBadge}>
                        <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
                        <Text style={styles.statusText}>Program Completed</Text>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
                        <LinearGradient
                            colors={['#4caf50', '#2e7d32']}
                            style={styles.gradientBtn}
                        >
                            <Text style={styles.completeBtnText}>Mark as Completed</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
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
        paddingTop: 40,
        paddingBottom: 20,
    },
    backBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 40,
    },
    infoItem: {
        alignItems: 'center',
    },
    infoText: {
        color: '#fff',
        marginTop: 5,
        fontWeight: '600',
    },
    completeBtn: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 5,
    },
    gradientBtn: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    completeBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(76,175,80,0.1)',
        borderRadius: 16,
        width: '100%',
        justifyContent: 'center',
    },
    statusText: {
        color: '#4caf50',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default ProgramActiveScreen;
