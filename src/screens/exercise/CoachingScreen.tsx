import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';

const CoachingScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: any) => state.auth);
    const [activeTab, setActiveTab] = useState<'appointments' | 'schedule'>("appointments");

    const [appointments, setAppointments] = useState<any[]>([]);
    const [coach, setCoach] = useState<any>(null);
    const [availability, setAvailability] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // 1. Get Subscription to find Coach
            const subRes = await axios.get(`${API_BASE_URL}/v1/subscriptions`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (subRes.data && subRes.data.length > 0) {
                const activeCoach = subRes.data[0].coach;
                setCoach(activeCoach);

                // Fetch coach availability
                const availRes = await axios.get(`${API_BASE_URL}/v1/coaches/${activeCoach.id}/availability`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setAvailability(availRes.data);
            }

            // 2. Get Appointments
            const apptRes = await axios.get(`${API_BASE_URL}/v1/appointments`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAppointments(apptRes.data);
        } catch (error) {
            console.error('CoachingScreen Fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user.token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const nextSession = appointments.find(a => a.status === 'accepted' || a.status === 'requested');

    return (
        <LinearGradient
            colors={['#1a0033', '#3a005f']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Coaching</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('YourCoinsScreen')}>
                        <View style={styles.iconButton}>
                            <Ionicons name="cash-outline" size={20} color="#F5C542" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'schedule' && styles.activeTabButton]}
                    onPress={() => setActiveTab('schedule')}
                >
                    <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'appointments' && styles.activeTabButton]}
                    onPress={() => setActiveTab('appointments')}
                >
                    <Text style={[styles.tabText, activeTab === 'appointments' && styles.activeTabText]}>Appointments</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" size="large" style={{ marginTop: 50 }} />
                ) : activeTab === 'appointments' ? (
                    <>
                        <Text style={styles.sectionTitle}>Next Session</Text>
                        {nextSession ? (
                            <View style={styles.upcomingCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.todayLabel}>{new Date(nextSession.appointment_date).toDateString()}</Text>
                                    {nextSession.status === 'accepted' && (
                                        <TouchableOpacity
                                            style={styles.joinBtn}
                                            onPress={() => navigation.navigate('VideoCall', {
                                                channelName: nextSession.channel_name,
                                                token: nextSession.agora_token,
                                                appId: '3d217b929db1457ab9e1166c7a0f2e37',
                                                callTitle: 'Nutrition Coaching'
                                            })}
                                        >
                                            <Text style={styles.joinBtnText}>Join Now</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <Text style={styles.sessionTitle}>Video Consultation</Text>
                                <Text style={styles.sessionTime}>{nextSession.start_time}</Text>
                                <Text style={[styles.statusTag, { color: nextSession.status === 'accepted' ? '#4caf50' : '#ff9800' }]}>
                                    {nextSession.status.toUpperCase()}
                                </Text>

                                <View style={styles.coachRow}>
                                    <View style={styles.placeholderAvatar}>
                                        <Ionicons name="person" size={16} color="#fff" />
                                    </View>
                                    <Text style={styles.coachNameSmall}>{nextSession.coach?.name || 'Your Coach'}</Text>
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.noDataText}>No upcoming sessions</Text>
                        )}

                        <Text style={styles.sectionTitle}>Your Coach</Text>
                        {coach ? (
                            <View style={styles.coachProfileCard}>
                                <View style={styles.profileRow}>
                                    <View style={styles.coachAvatarLarge}>
                                        <Ionicons name="person" size={30} color="#fff" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.profileName}>{coach.name}</Text>
                                        <Text style={styles.profileRole}>Fitness & Nutrition Expert</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.videoCallBtn}
                                        onPress={() => navigation.navigate('VideoConsultation')}
                                    >
                                        <Text style={styles.videoCallText}>Book Call</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.noDataText}>You haven't subscribed to a coach yet</Text>
                        )}
                    </>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Manage Calls</Text>
                        <TouchableOpacity
                            style={styles.bookSessionCard}
                            onPress={() => navigation.navigate('VideoConsultation')}
                        >
                            <View style={styles.bookIconData}>
                                <Ionicons name="videocam" size={24} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.bookTitle}>Book Video Consultation</Text>
                                <Text style={styles.bookSubtitle}>Pick a slot from your coach's calendar</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Coach Weekly Availability</Text>
                        {availability.length > 0 ? (
                            <View style={styles.availabilityList}>
                                {availability.map((item, index) => (
                                    <View key={index} style={styles.availabilityItem}>
                                        <View style={styles.dayIcon}>
                                            <Ionicons name="calendar-outline" size={20} color="#fff" />
                                        </View>
                                        <Text style={styles.availabilityText}>
                                            Day {item.day_of_week}: {item.start_time} - {item.end_time}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noDataText}>Availability details not set</Text>
                        )}
                    </>
                )}
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 4,
        marginBottom: 10,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTabButton: {
        backgroundColor: '#7b1fa2',
    },
    tabText: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },
    upcomingCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    todayLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    joinBtn: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    joinBtnText: {
        color: '#4caf50',
        fontSize: 12,
        fontWeight: 'bold',
    },
    sessionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sessionTime: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 5,
    },
    statusTag: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 15,
    },
    coachRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeholderAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    coachNameSmall: {
        color: '#fff',
        fontSize: 14,
    },
    coachProfileCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    coachAvatarLarge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    profileName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileRole: {
        color: '#ccc',
        fontSize: 12,
    },
    videoCallBtn: {
        backgroundColor: '#5e35b1',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
    },
    videoCallText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    availabilityList: {
        marginTop: 5,
    },
    availabilityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    dayIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    availabilityText: {
        color: '#fff',
        fontSize: 14,
    },
    bookSessionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 15,
        marginBottom: 20,
    },
    bookIconData: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#7b1fa2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    bookTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bookSubtitle: {
        color: '#aaa',
        fontSize: 12,
    },
    noDataText: {
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 14,
    }
});

export default CoachingScreen;
