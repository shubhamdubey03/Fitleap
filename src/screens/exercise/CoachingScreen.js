import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';

const CoachingScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("appointments");

    const [appointments, setAppointments] = useState([]);
    const [allCoaches, setAllCoaches] = useState([]);
    const [selectedCoachId, setSelectedCoachId] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // 1. Get Subscriptions
            const subRes = await axios.get(`${API_BASE_URL}/v1/subscriptions/`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (subRes.data && subRes.data.length > 0) {
                const uniqueCoaches = [];
                const ids = new Set();
                subRes.data.forEach(s => {
                    if (s.coach && !ids.has(s.coach.id)) {
                        uniqueCoaches.push(s.coach);
                        ids.add(s.coach.id);
                    }
                });
                setAllCoaches(uniqueCoaches);

                // Default to first coach if none selected
                const targetCoachId = selectedCoachId || uniqueCoaches[0].id;
                if (!selectedCoachId) setSelectedCoachId(targetCoachId);

                // 2. Fetch selected coach availability
                const availRes = await axios.get(`${API_BASE_URL}/v1/coaches/${targetCoachId}/availability`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setAvailability(availRes.data || []);
            }

            // 3. Get Appointments
            const apptRes = await axios.get(`${API_BASE_URL}/v1/appointments`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAppointments(apptRes.data || []);
        } catch (error) {
            console.error('CoachingScreen Fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user.token, selectedCoachId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const nextSession = appointments.find(a => a.status === 'accepted' || a.status === 'requested');

    const handleSwitchCoach = async (id) => {
        setSelectedCoachId(id);
        setLoading(true);
        try {
            const availRes = await axios.get(`${API_BASE_URL}/v1/coaches/${id}/availability`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAvailability(availRes.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3a005f']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Coaching</Text>
                <TouchableOpacity onPress={() => navigation.navigate('YourCoinsScreen')}>
                    <View style={styles.iconButton}>
                        <Ionicons name="cash-outline" size={20} color="#F5C542" />
                    </View>
                </TouchableOpacity>
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
                {loading && !refreshing ? (
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
                                <Text style={styles.sessionTitleText}>Video Consultation</Text>
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

                        <Text style={styles.sectionTitle}>Your Coaches</Text>
                        {allCoaches.length > 0 ? (
                            allCoaches.map((c) => (
                                <View key={c.id} style={styles.coachProfileCard}>
                                    <View style={styles.profileRow}>
                                        <View style={styles.coachAvatarLarge}>
                                            <Ionicons name="person" size={30} color="#fff" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.profileName}>{c.name}</Text>
                                            <Text style={styles.profileRole}>Fitness & Nutrition Expert</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <TouchableOpacity
                                                style={styles.chatIconBtn}
                                                onPress={() => navigation.navigate('Chat', { receiverId: c.id, receiverName: c.name })}
                                            >
                                                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.videoCallBtn}
                                                onPress={() => navigation.navigate('VideoConsultation', { coachId: c.id })}
                                            >
                                                <Text style={styles.videoCallText}>Book Call</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>You haven't subscribed to a coach yet</Text>
                        )}
                    </>
                ) : (
                    <>
                        {allCoaches.length > 0 && (
                            <View>
                                <Text style={styles.sectionTitle}>Select Coach</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                    {allCoaches.map((c) => (
                                        <TouchableOpacity
                                            key={c.id}
                                            style={[
                                                styles.coachChip,
                                                selectedCoachId === c.id && styles.selectedCoachChip
                                            ]}
                                            onPress={() => handleSwitchCoach(c.id)}
                                        >
                                            <Text style={[
                                                styles.coachChipText,
                                                selectedCoachId === c.id && styles.selectedCoachChipText
                                            ]}>{c.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <Text style={styles.sectionTitle}>Manage Calls</Text>
                        <TouchableOpacity
                            style={styles.bookSessionCard}
                            onPress={() => navigation.navigate('VideoConsultation', { coachId: selectedCoachId })}
                        >
                            <View style={styles.bookIconData}>
                                <Ionicons name="videocam" size={24} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.bookTitle}>Book Video Consultation</Text>
                                <Text style={styles.bookSubtitle}>Pick a slot from calendar</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Weekly Availability</Text>
                        {availability.length > 0 ? (
                            <View style={styles.availabilityList}>
                                {availability.map((item, index) => (
                                    <View key={index} style={styles.availabilityItem}>
                                        <View style={styles.dayIcon}>
                                            <Ionicons name="time-outline" size={20} color="#fff" />
                                        </View>
                                        <View>
                                            <Text style={styles.availabilityDay}>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][item.day_of_week]}</Text>
                                            <Text style={styles.availabilityTime}>{item.start_time}:00 - {item.end_time}:00</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noDataText}>No custom availability set for this coach</Text>
                        )}
                    </>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
    iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 10 },
    tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
    activeTabButton: { backgroundColor: '#7b1fa2' },
    tabText: { color: '#ccc', fontSize: 14, fontWeight: '600' },
    activeTabText: { color: '#fff' },
    scrollContent: { padding: 20 },
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
    upcomingCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 20, marginBottom: 20 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    todayLabel: { color: '#aaa', fontSize: 14 },
    joinBtn: { backgroundColor: 'rgba(76, 175, 80, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    joinBtnText: { color: '#4caf50', fontSize: 12, fontWeight: 'bold' },
    sessionTitleText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    sessionTime: { color: '#ccc', fontSize: 14, marginBottom: 5 },
    statusTag: { fontSize: 11, fontWeight: '700', marginBottom: 15 },
    coachRow: { flexDirection: 'row', alignItems: 'center' },
    placeholderAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    coachNameSmall: { color: '#fff', fontSize: 14 },
    coachProfileCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 20, marginBottom: 20 },
    profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    coachAvatarLarge: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    profileName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    profileRole: { color: '#ccc', fontSize: 12 },
    videoCallBtn: { backgroundColor: '#FF6B3D', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
    videoCallText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    chatIconBtn: { backgroundColor: '#7b1fa2', width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    bookSessionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 15, marginBottom: 20 },
    bookIconData: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#7b1fa2', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    bookTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    bookSubtitle: { color: '#aaa', fontSize: 12 },
    availabilityList: { marginTop: 5 },
    availabilityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 12 },
    dayIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    availabilityDay: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    availabilityTime: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
    noDataText: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginVertical: 20, fontSize: 14 },
    coachChip: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    selectedCoachChip: { backgroundColor: '#FF6B3D', borderColor: '#FF6B3D' },
    coachChipText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
    selectedCoachChipText: { color: '#fff', fontWeight: 'bold' },
});

export default CoachingScreen;
