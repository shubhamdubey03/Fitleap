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
    TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUser } from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL, CHAT_URL, AUTH_URL } from '../config/api';
const AGORA_APP_ID = '3d217b929db1457ab9e1166c7a0f2e37';

const { width } = Dimensions.get('window');

const CoachDashboardScreen = ({ navigation }) => {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Diet Modal States
    const [isDietModalVisible, setIsDietModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [foodName, setFoodName] = useState('');
    const [foodType, setFoodType] = useState('');
    const [dietLoading, setDietLoading] = useState(false);
    const [isFree, setIsFree] = useState(false);
    const [students, setStudents] = useState([]);

    const user = useSelector(state => state.auth.user);
    console.log("user", user)
    const dispatch = useDispatch();

    const fetchSubscribers = useCallback(async () => {
        if (!user?.token) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/v1/appointments/students/me/subscriptions`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log("Subscribers (Active Students) fetched", response.data)
            setStudents(response.data.students || []);
        } catch (error) {
            console.error('Fetch subscribers error:', error);
        }
    }, [user?.token]);

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

    const fetchUnreadCount = useCallback(async () => {
        if (!user?.token) return;
        try {
            const response = await axios.get(`${CHAT_URL}/conversations`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                const totalUnread = response.data.data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
                setUnreadCount(totalUnread);
            }
        } catch (error) {
            console.error('Fetch unread count error:', error);
        }
    }, [user?.token]);

    const fetchUserProfile = useCallback(async () => {
        if (!user?.token) return;
        try {
            const response = await axios.get(`${AUTH_URL}/profile`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const userData = response.data.user || response.data;
            const updatedUser = { ...user, ...userData };
            dispatch(setUser(updatedUser));
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Fetch profile error:', error);
        }
    }, [user?.token, dispatch]);

    useFocusEffect(
        useCallback(() => {
            fetchUnreadCount();
            fetchUserProfile();
            fetchSubscribers();
        }, [fetchUnreadCount, fetchUserProfile, fetchSubscribers])
    );

    useEffect(() => {
        const checkAuth = async () => {
            if (user?.token) {
                fetchAppointments();
                fetchSubscribers();
                return;
            }

            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.token) {
                    fetchAppointments();
                    fetchSubscribers();
                    return;
                }
            }
            navigation.replace('Login');
        };

        checkAuth();
    }, [user, navigation, fetchAppointments, fetchSubscribers]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAppointments();
        fetchSubscribers();
        fetchUnreadCount();
        fetchUserProfile();
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

    const selectStudentForDiet = (student) => {
        setSelectedStudent(student);
    };

    const handleAddDiet = async () => {
        if (!foodName || !foodType) {
            Alert.alert('Error', 'Please fill all fields (Food Name and Food Type)');
            return;
        }

        // Paid diets require a student to be selected
        if (!isFree && !selectedStudent) {
            Alert.alert('Error', 'Please select a student for a paid diet plan');
            return;
        }

        setDietLoading(true);

        try {
            if (isFree && !selectedStudent) {
                // 🌐 Global free diet — no user_id, visible to ALL users
                await axios.post(`${API_BASE_URL}/diet/add`, {
                    user_id: null,
                    coach_id: user.id,
                    food_name: foodName,
                    food_type: foodType,
                    is_free: true
                }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                Alert.alert('Success', '🎉 Free diet added! All users can now see it.');
            } else {
                // 👤 Specific student diet
                await axios.post(`${API_BASE_URL}/diet/add`, {
                    user_id: selectedStudent.id,
                    coach_id: user.id,
                    food_name: foodName,
                    food_type: foodType,
                    is_free: isFree
                }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                Alert.alert('Success', 'Diet added successfully!');
            }

            setSelectedStudent(null);
            setFoodName('');
            setFoodType('');
            setIsFree(false);
            setIsDietModalVisible(false);
        } catch (error) {
            console.error('Add diet error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to add diet');
        } finally {
            setDietLoading(false);
        }
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={[styles.statusText, { color: item.status === 'expired' ? '#F1C40F' : '#E74C3C' }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
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
                        <TouchableOpacity onPress={() => navigation.navigate('CoachFeedback')} style={styles.iconBtn}>
                            <Ionicons name="star-outline" size={24} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ChatList')} style={styles.iconBtn}>
                            <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
                            {unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                            <Ionicons name="log-out-outline" size={24} color="#FF6B3D" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{students.length}</Text>
                        <Text style={styles.statLabel}>Total Students</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{requested.length}</Text>
                        <Text style={styles.statLabel}>Session Requests</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{students.length}</Text>
                        <Text style={styles.statLabel}>Active Subscriptions</Text>
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

                {/* Add Diet Toggle Button */}
                <TouchableOpacity
                    style={styles.mainAddDietBtn}
                    onPress={() => setIsDietModalVisible(!isDietModalVisible)}
                >
                    <LinearGradient
                        colors={['#F39C12', '#E67E22']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.mainAddDietBtnGradient}
                    >
                        <Ionicons name="restaurant" size={20} color="#fff" />
                        <Text style={styles.mainAddDietBtnText}>
                            {isDietModalVisible ? 'Close Diet Form' : 'Add New Diet Plan'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Inline Diet Form */}
                {isDietModalVisible && (
                    <View style={styles.inlineDietContainer}>
                        <View style={styles.nestedFormBody}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Select Student</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studentSelector}>
                                    {students.length > 0 ? (
                                        students.map((student) => (
                                            <TouchableOpacity
                                                key={student.id}
                                                onPress={() => setSelectedStudent(student)}
                                                style={[
                                                    styles.studentSelectorItem,
                                                    selectedStudent?.id === student.id && styles.studentSelectorItemActive
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.studentSelectorText,
                                                    selectedStudent?.id === student.id && styles.studentSelectorTextActive
                                                ]}>
                                                    {student.name || 'Student'}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: 12 }}>No students found (Requires at least one appointment request).</Text>
                                    )}
                                </ScrollView>
                                {!selectedStudent && !isFree && (
                                    <Text style={{ color: '#E74C3C', fontSize: 12, marginTop: 5 }}>
                                        Please select a student first
                                    </Text>
                                )}
                                {!selectedStudent && isFree && (
                                    <Text style={{ color: '#2ECC71', fontSize: 12, marginTop: 5 }}>
                                        ✓ Will be sent to all your students
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Food Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={foodName}
                                    onChangeText={setFoodName}
                                    placeholder="e.g. Grilled Chicken Salad"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Food Type</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
                                    {['breakfast', 'lunch', 'dinner', 'snacks'].map(type => (
                                        <TouchableOpacity
                                            key={type}
                                            onPress={() => setFoodType(type)}
                                            style={[
                                                styles.studentSelectorItem,
                                                foodType === type && styles.studentSelectorItemActive
                                            ]}
                                        >
                                            <Text style={[
                                                styles.studentSelectorText,
                                                foodType === type && styles.studentSelectorTextActive
                                            ]}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                {!foodType && (
                                    <Text style={{ color: '#E74C3C', fontSize: 12, marginTop: 5 }}>
                                        Please select a food type
                                    </Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.label}>Mark as Free Diet</Text>
                                    <TouchableOpacity
                                        onPress={() => setIsFree(!isFree)}
                                        style={[
                                            { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10 },
                                            isFree ? { backgroundColor: '#2ECC71' } : { backgroundColor: 'rgba(255,255,255,0.1)' }
                                        ]}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                                            {isFree ? 'FREE' : 'PAID'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 5 }}>
                                    Free diets do not require the user to have an active subscription.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.submitBtn, (dietLoading || (!selectedStudent && !isFree)) && { opacity: 0.7 }]}
                                onPress={handleAddDiet}
                                disabled={dietLoading || (!selectedStudent && !isFree)}
                            >
                                {dietLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Add Diet Plan</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

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
    badge: {
        position: 'absolute',
        right: -2,
        top: -2,
        backgroundColor: '#FF6B3D',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#000',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inlineDietContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    mainAddDietBtn: {
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
    },
    mainAddDietBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        gap: 10,
    },
    mainAddDietBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    studentSelector: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 10,
    },
    studentSelectorItem: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    studentSelectorItemActive: {
        backgroundColor: '#F39C12',
        borderColor: '#F39C12',
    },
    studentSelectorText: {
        color: '#aaa',
        fontSize: 13,
    },
    studentSelectorTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    nestedFormBody: {
        marginTop: 5,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    submitBtn: {
        backgroundColor: '#FF6B3D',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CoachDashboardScreen;
