import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
const AGORA_APP_ID = '3d217b929db1457ab9e1166c7a0f2e37';

const { width } = Dimensions.get('window');

const CoachDashboardScreen = ({ navigation }) => {
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const fetchAppointments = useCallback(async () => {
        if (!user?.token) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/v1/appointments/coaches/me/appointments`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log("appointments", response.data);
            setAppointments(response.data);
        } catch (error) {
            console.error('Fetch appointments error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.token]);

    console.log("appointmentslllllllll", appointments);

    useEffect(() => {
        const checkAuth = async () => {
            if (user?.token) {
                fetchAppointments();
                return;
            }

            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.token) {
                    fetchAppointments();
                    return;
                }
            }

            console.log('No token found in CoachDashboard, redirecting to Login');
            navigation.replace('Login');
        };

        checkAuth();
    }, [user, navigation, fetchAppointments]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAppointments();
    };

    const handleLogout = async () => {
        await dispatch(logout()).unwrap();
        await AsyncStorage.removeItem('IS_LOGGED_IN');
        await AsyncStorage.removeItem('USER_ROLE');
        await AsyncStorage.removeItem('COACH_NAME');
        navigation.replace('Login');
    };

    const handleAccept = async (id) => {
        try {
            await axios.patch(`${API_BASE_URL}/v1/appointments/${id}/accept`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            Alert.alert('Success', 'Appointment accepted');
            fetchAppointments();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to accept');
        }
    };

    const handleReject = async (id) => {
        Alert.prompt(
            'Reject Appointment',
            'Reason for rejection:',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    onPress: async (reason) => {
                        try {
                            await axios.patch(`${API_BASE_URL}/v1/appointments/${id}/reject`, { reason }, {
                                headers: { Authorization: `Bearer ${user.token}` }
                            });
                            Alert.alert('Success', 'Appointment rejected');
                            fetchAppointments();
                        } catch (error) {
                            Alert.alert('Error', error.response?.data?.error || 'Failed to reject');
                        }
                    },
                },
            ],
            'plain-text'
        );
    };

    const handleCancel = async (id) => {
        Alert.alert(
            'Cancel Appointment',
            'Are you sure you want to cancel this accepted appointment?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.patch(`${API_BASE_URL}/v1/appointments/${id}/cancel`, {}, {
                                headers: { Authorization: `Bearer ${user.token}` }
                            });
                            Alert.alert('Success', 'Appointment cancelled');
                            fetchAppointments();
                        } catch (error) {
                            Alert.alert('Error', error.response?.data?.error || 'Failed to cancel');
                        }
                    },
                },
            ]
        );
    };

    const requested = appointments.filter(a => a.status === 'requested');
    const accepted = appointments.filter(a => a.status === 'accepted');

    // Filter active sessions to only those that are 'accepted' AND for TODAY
    const activeSessions = accepted.filter(item => {
        const today = new Date().toISOString().split('T')[0];
        const apptDate = new Date(item.appointment_date).toISOString().split('T')[0];
        return today === apptDate;
    }).sort((a, b) => a.start_time.localeCompare(b.start_time));

    const renderAppointmentItem = (item) => (
        <View key={item.id} style={styles.studentItem}>
            <View style={styles.studentInfo}>
                <View style={styles.studentIcon}>
                    <Ionicons name="person" size={18} color="#fff" />
                </View>
                <View>
                    <Text style={styles.studentName}>{item.user?.name || 'User'}</Text>
                    <Text style={styles.studentPlan}>{new Date(item.appointment_date).toDateString()} at {item.start_time}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                {item.status === 'requested' ? (
                    <>
                        <TouchableOpacity onPress={() => handleAccept(item.id)} style={[styles.actionBtn, { backgroundColor: '#2ECC71' }]}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCancel(item.id)} style={[styles.actionBtn, { backgroundColor: '#E74C3C' }]}>
                            <Ionicons name="close" size={16} color="#fff" />
                        </TouchableOpacity>
                    </>
                ) : item.status === 'accepted' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={[styles.statusText, { color: '#2ECC71' }]}>
                            {item.status.toUpperCase()}
                        </Text>
                        <TouchableOpacity onPress={() => handleCancel(item.id)} style={[styles.actionBtn, { backgroundColor: '#E74C3C' }]}>
                            <Ionicons name="close" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={[styles.statusText, { color: item.status === 'expired' ? '#F1C40F' : '#E74C3C' }]}>
                        {item.status.toUpperCase()}
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#000000', '#1a0b2e', '#2b0040']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
            >

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('EditProfileScreen')}
                        style={styles.userInfo}
                    >
                        <Image
                            source={{ uri: user?.profile_image || 'https://i.pravatar.cc/150?img=3' }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.greeting}>Hello {user?.name || 'Coach'}</Text>
                            <Text style={styles.subGreeting}>Coach Portal</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => navigation.navigate('ChatList')} style={styles.iconBtn}>
                            <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.iconBtn}>
                            <Ionicons name="menu-outline" size={26} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                            <Ionicons name="log-out-outline" size={24} color="#FF6B3D" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{appointments.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{requested.length}</Text>
                        <Text style={styles.statLabel}>Requested</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{accepted.length}</Text>
                        <Text style={styles.statLabel}>Approved</Text>
                    </View>
                </View>

                {/* Active Sessions (Join Call) */}
                <Text style={styles.sectionTitle}>Active Sessions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {activeSessions.length > 0 ? activeSessions.map((item) => (
                        <LinearGradient
                            key={item.id}
                            colors={['#FF6B3D', '#FF8E53']}
                            style={styles.classCard}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.classTime}>{item.start_time}</Text>
                                <Text style={styles.className}>{item.user?.name || 'Session'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                <TouchableOpacity
                                    style={styles.joinBtn}
                                    onPress={() => {
                                        navigation.navigate('VideoCall', {
                                            appointmentId: item.id,
                                            channelName: item.channel_name,
                                            token: item.agora_token,
                                            appId: AGORA_APP_ID,
                                            callTitle: 'Nutrition Coaching',
                                            userName: item.user?.name
                                        })
                                    }}
                                >
                                    <Ionicons name="videocam" size={16} color="#FF6B3D" />
                                    <Text style={styles.joinBtnText}>Join</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.joinBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#fff' }]}
                                    onPress={() => handleCancel(item.id)}
                                >
                                    <Ionicons name="close" size={16} color="#fff" />
                                    <Text style={[styles.joinBtnText, { color: '#fff' }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    )) : (
                        <View style={[styles.classCard, { backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center' }]}>
                            <Text style={{ color: '#aaa', textAlign: 'center' }}>No approved sessions yet</Text>
                        </View>
                    )}
                </ScrollView>

                {/* Appointment List */}
                <View style={styles.listHeader}>
                    <Text style={styles.sectionTitle}>All Appointments</Text>
                </View>

                <View style={styles.studentListContainer}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : appointments.length > 0 ? (
                        appointments.map((item) => renderAppointmentItem(item))
                    ) : (
                        <Text style={{ color: '#aaa', textAlign: 'center' }}>No appointments yet</Text>
                    )}
                </View>

                <DashboardSidebar
                    visible={isSidebarVisible}
                    onClose={() => setSidebarVisible(false)}
                    navigation={navigation}
                />
            </ScrollView>
        </LinearGradient >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    greeting: {
        color: '#ccc',
        fontSize: 14,
    },
    subGreeting: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    iconBtn: {
        padding: 5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        width: (width - 60) / 3,
        padding: 15,
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        color: '#aaa',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    horizontalScroll: {
        marginBottom: 30,
    },
    classCard: {
        width: 180,
        height: 120,
        borderRadius: 15,
        padding: 15,
        marginRight: 15,
    },
    classTime: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '600',
    },
    className: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    joinBtn: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 10,
        gap: 5,
        flex: 0.45,
    },
    joinBtnText: {
        color: '#FF6B3D',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    studentListContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 15,
    },
    studentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    studentIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    studentName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    studentPlan: {
        color: '#aaa',
        fontSize: 11,
    },
    actionBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default CoachDashboardScreen;
