import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import RazorpayCheckout from 'react-native-razorpay';

const ProgramsAndChallengesScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Programs');
    const [loading, setLoading] = useState(true);
    const [programs, setPrograms] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const user = useSelector((state) => state.auth.user);

    const token = user?.token || user?.access_token;

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/pc`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPrograms(response.data.programs || []);
            setIsSubscribed(response.data.subscription || false);
        } catch (error) {
            console.error('Error fetching programs:', error);
            Alert.alert('Error', 'Failed to load programs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubscribe = () => {
        navigation.navigate('ProgramSubscriptionPlans');
    };


    const handleEnroll = async (pcId) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/pc/enroll`,
                { pc_id: pcId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', response.data.message || 'Enrolled successfully!');
            fetchData(); // Refresh to update button status
            // Navigate to active screen
            const program = programs.find(p => p.id === pcId);
            if (program) {
                navigation.navigate('ProgramActive', { program });
            }
        } catch (error) {
            console.error('Enroll Error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to enroll.');
        }
    };

    const renderProgramCard = (item) => {
        const { id, title, description, duration_days, is_locked, is_free, is_admin_created, user_enrollment_status } = item;
        // Mock image mapping or fallback
        const imageUri = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

        const isCompleted = user_enrollment_status === 'completed';
        const isEnrolled = user_enrollment_status === 'enrolled';

        const CardContent = (
            <View key={id} style={styles.card}>
                <Image source={{ uri: imageUri }} style={styles.cardImage} />
                {is_locked && (
                    <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={24} color="#fff" />
                    </View>
                )}
                <View style={[styles.priceBadge, { backgroundColor: is_free ? '#4caf50' : '#7b1fa2' }]}>
                    <Text style={styles.priceBadgeText}>{is_free ? 'Free' : 'Paid'}</Text>
                </View>
                {is_admin_created && (
                    <View style={styles.adminBadge}>
                        <Text style={styles.adminBadgeText}>Official</Text>
                    </View>
                )}
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{description}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.duration}>{duration_days} days</Text>
                    {is_locked ? (
                        <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
                            <Text style={styles.enrollText}>Subscribe</Text>
                        </TouchableOpacity>
                    ) : isCompleted ? (
                        <View style={styles.completedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
                            <Text style={[styles.enrollText, { color: '#4caf50', marginLeft: 4 }]}>Completed</Text>
                        </View>
                    ) : isEnrolled ? (
                        <TouchableOpacity
                            style={styles.completeButton}
                            onPress={() => navigation.navigate('ProgramActive', { program: item })}
                        >
                            <Text style={styles.enrollText}>Start / View</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.enrollButton} onPress={() => handleEnroll(id)}>
                            <Text style={styles.enrollText}>Enroll</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );

        if (isEnrolled || isCompleted) {
            return (
                <TouchableOpacity key={id} activeOpacity={0.9} onPress={() => navigation.navigate('ProgramActive', { program: item })}>
                    {CardContent}
                </TouchableOpacity>
            );
        }

        return CardContent;
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
                <Text style={styles.headerTitle}>Programs & Challenges</Text>
                <Image
                    source={{ uri: user?.profile_image || 'https://i.pravatar.cc/150?img=3' }}
                    style={styles.headerAvatar}
                />
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Programs' && styles.activeTab]}
                    onPress={() => setActiveTab('Programs')}
                >
                    <Text style={[styles.tabText, activeTab === 'Programs' && styles.activeTabText]}>Programs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Challenges' && styles.activeTab]}
                    onPress={() => setActiveTab('Challenges')}
                >
                    <Text style={[styles.tabText, activeTab === 'Challenges' && styles.activeTabText]}>Challenges</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {!isSubscribed && (
                        <LinearGradient
                            colors={['#FFD700', '#FFA500']}
                            style={styles.subscriptionBanner}
                        >
                            <View>
                                <Text style={styles.bannerTitle}>Unlock Premium Content</Text>
                                <Text style={styles.bannerSub}>Get access to all programs & challenges</Text>
                            </View>
                            <TouchableOpacity style={styles.bannerBtn} onPress={handleSubscribe}>
                                <Text style={styles.bannerBtnText}>Subscribe</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    )}

                    {programs.filter(p => p.type.toLowerCase() === activeTab.toLowerCase().slice(0, -1)).length > 0 ? (
                        programs
                            .filter(p => p.type.toLowerCase() === activeTab.toLowerCase().slice(0, -1))
                            .map(renderProgramCard)
                    ) : (
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: '#ccc', fontSize: 16 }}>No active {activeTab.toLowerCase()} at the moment.</Text>
                        </View>
                    )}
                </ScrollView>
            )}
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
    headerAvatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tab: {
        marginRight: 20,
        paddingBottom: 5,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    tabText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#1f0033',
        marginBottom: 20,
        borderRadius: 16,
        padding: 16,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        marginBottom: 12,
    },
    lockOverlay: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        height: 150,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    cardDescription: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 12,
        lineHeight: 18,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    duration: {
        color: '#aaa',
        fontSize: 12,
    },
    enrollButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    subscribeBtn: {
        backgroundColor: '#7b1fa2',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    completeButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderRadius: 20,
    },
    enrollText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    subscriptionBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    bannerTitle: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    bannerSub: {
        color: '#333',
        fontSize: 10,
    },
    bannerBtn: {
        backgroundColor: '#000',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
    },
    bannerBtnText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    adminBadge: {
        position: 'absolute',
        top: 25,
        right: 25,
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    adminBadgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    priceBadge: {
        position: 'absolute',
        top: 25,
        left: 25,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priceBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default ProgramsAndChallengesScreen;
