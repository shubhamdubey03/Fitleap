import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const VideoConsultationScreen = ({ navigation, route }) => {
    const { coachId } = route.params || {};
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state) => state.auth);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());

    const [appointments, setAppointments] = useState([]);
    const [coach, setCoach] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // 1. Get Subscription to find Coach
            const subRes = await axios.get(`${API_BASE_URL}/v1/subscriptions/`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log("subRes.data", JSON.stringify(subRes.data));

            if (subRes.data && subRes.data.length > 0) {
                if (coachId) {
                    const targetSub = subRes.data.find(s => s.coach?.user_id === coachId);
                    if (targetSub) {
                        setCoach(targetSub.coach);
                    } else {
                        setCoach(subRes.data[0].coach);
                    }
                } else {
                    setCoach(subRes.data[0].coach);
                }
            }

            // 2. Get Appointments
            const apptRes = await axios.get(`${API_BASE_URL}/v1/appointments`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAppointments(apptRes.data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user.token]);

    const fetchSlots = useCallback(async (date) => {
        if (!coach) return;
        setSlotsLoading(true);
        setSelectedSlot(null); // Reset selection when date changes
        try {
            const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
            const response = await axios.get(`${API_BASE_URL}/v1/coaches/${coach.id}/slots?date=${dateStr}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAvailableSlots(response.data.available_slots || []);
        } catch (error) {
            console.error('Fetch slots error:', error);
            setAvailableSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    }, [coach, currentDate, user.token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (selectedDate) fetchSlots(selectedDate);
    }, [selectedDate, fetchSlots]);

    const handleBookSession = async () => {
        if (!selectedSlot) {
            Alert.alert('Selection Required', 'Please select a time slot first');
            return;
        }
        try {
            const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
            await axios.post(`${API_BASE_URL}/v1/appointments`, {
                coach_id: coach.id,
                appointment_date: dateStr,
                start_time: selectedSlot
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            Alert.alert('Success', 'Consultation Request Sent!');
            setSelectedSlot(null);
            fetchData(); // Refresh list
            fetchSlots(selectedDate); // Refresh slots
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Booking failed');
        }
    };

    const handleCancelAppointment = async (id) => {
        Alert.alert(
            'Cancel Appointment',
            'Are you sure you want to cancel this appointment?',
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
                            fetchData(); // Refresh list
                        } catch (error) {
                            Alert.alert('Error', error.response?.data?.error || 'Failed to cancel');
                        }
                    },
                },
            ]
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
        setSelectedDate(1);
    };

    const renderCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);

        const dates = [];
        for (let i = 0; i < firstDay; i++) {
            dates.push(<View key={`empty-${i}`} style={styles.dateCell} />);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const hasAppointment = appointments.some(appt => {
                const apptDate = new Date(appt.appointment_date);
                return apptDate.getDate() === d && apptDate.getMonth() === month && apptDate.getFullYear() === year;
            });

            dates.push(
                <TouchableOpacity
                    key={d}
                    style={[
                        styles.dateCell,
                        selectedDate === d && styles.selectedDateCell
                    ]}
                    onPress={() => setSelectedDate(d)}
                >
                    <Text style={[
                        styles.dateText,
                        selectedDate === d && styles.selectedDateText
                    ]}>{d}</Text>
                    {hasAppointment && <View style={styles.dot} />}
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
                        <Ionicons name="chevron-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
                    <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
                        <Ionicons name="chevron-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.daysRow}>
                    {DAYS.map((day, index) => (
                        <Text key={index} style={styles.dayLabel}>{day}</Text>
                    ))}
                </View>

                <View style={styles.datesGrid}>
                    {dates}
                </View>
            </View>
        );
    };

    const upcoming = appointments.filter(a => a.status === 'accepted' || a.status === 'requested');
    const history = appointments.filter(a => a.status === 'completed' || a.status === 'rejected' || a.status === 'cancelled');

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
                <Text style={styles.headerTitle}>Consultations</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
            >
                {renderCalendar()}

                {/* Slots Section */}
                <Text style={styles.sectionTitle}>Available Slots ({selectedDate} {MONTHS[currentDate.getMonth()]})</Text>
                {slotsLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : availableSlots.length > 0 ? (
                    <View>
                        <View style={styles.slotsGrid}>
                            {availableSlots.map((slot, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.slotButton,
                                        selectedSlot === slot && styles.selectedSlotButton
                                    ]}
                                    onPress={() => setSelectedSlot(slot)}
                                >
                                    <Text style={[
                                        styles.slotText,
                                        selectedSlot === slot && styles.selectedSlotText
                                    ]}>{slot}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {selectedSlot && (
                            <TouchableOpacity
                                style={styles.bookNowBtn}
                                onPress={handleBookSession}
                            >
                                <LinearGradient
                                    colors={['#FF6B3D', '#FF8E53']}
                                    style={styles.bookNowGradient}
                                >
                                    <Text style={styles.bookNowText}>Book Session at {selectedSlot}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <Text style={styles.noDataText}>{coach ? 'No slots available for this date' : 'Please subscribe to a coach first'}</Text>
                )}

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                {loading ? (
                    <ActivityIndicator color="#fff" style={{ marginVertical: 20 }} />
                ) : upcoming.length > 0 ? (
                    upcoming.map((appt) => (
                        <View key={appt.id} style={styles.consultationCard}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                                style={styles.cardGradient}
                            >
                                <View style={styles.cardLeft}>
                                    <View style={[styles.iconContainer, { backgroundColor: appt.status === 'accepted' ? '#4caf50' : '#ff9800' }]}>
                                        <Ionicons name="videocam" size={20} color="#fff" />
                                    </View>
                                    <View>
                                        <Text style={styles.consultationTitle}>Coach: {appt.coach?.name || 'Assigned Coach'}</Text>
                                        <Text style={styles.consultationTime}>
                                            {new Date(appt.appointment_date).toDateString()}, {appt.start_time}
                                        </Text>
                                        <Text style={[styles.statusTag, { color: appt.status === 'accepted' ? '#4caf50' : '#ff9800' }]}>
                                            {appt.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => handleCancelAppointment(appt.id)}
                                        style={styles.cancelActionBtn}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#ff5252" />
                                    </TouchableOpacity>

                                    {appt.status === 'accepted' && (
                                        <TouchableOpacity
                                            style={styles.joinBtn}
                                            onPress={() => navigation.navigate('VideoCall', {
                                                channelName: appt.channel_name,
                                                token: appt.agora_token,
                                                appId: '3d217b929db1457ab9e1166c7a0f2e37',
                                                callTitle: 'Consultation'
                                            })}
                                        >
                                            <Text style={styles.joinBtnText}>Join</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </LinearGradient>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No upcoming consultations</Text>
                )}

                <Text style={styles.sectionTitle}>History</Text>
                {history.length > 0 ? history.map((appt) => (
                    <View key={appt.id} style={styles.historyCard}>
                        <View style={styles.cardLeft}>
                            <View style={styles.smallIconContainer}>
                                <Ionicons
                                    name={appt.status === 'completed' ? "checkmark-circle" : "close-circle"}
                                    size={16}
                                    color={appt.status === 'completed' ? "#4caf50" : "#f44336"}
                                />
                            </View>
                            <View>
                                <Text style={styles.historyTitle}>{appt.coach?.name || 'Coach'} - Session</Text>
                                <Text style={styles.historyTime}>{new Date(appt.appointment_date).toDateString()}</Text>
                            </View>
                        </View>
                        <Text style={[styles.statusText, { color: appt.status === 'completed' ? '#4caf50' : '#f44336' }]}>
                            {appt.status.toUpperCase()}
                        </Text>
                    </View>
                )) : (
                    <Text style={styles.noDataText}>No consultation history</Text>
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    calendarContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 15,
        marginBottom: 20,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    navButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    dayLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: 'bold',
        width: (Dimensions.get('window').width - 70) / 7,
        textAlign: 'center',
    },
    datesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dateCell: {
        width: (Dimensions.get('window').width - 70) / 7,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        borderRadius: 12,
    },
    selectedDateCell: {
        backgroundColor: '#7b1fa2',
    },
    dateText: {
        color: '#fff',
        fontSize: 15,
    },
    selectedDateText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ffb74d',
        position: 'absolute',
        bottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 10,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 15,
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },
    slotButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        minWidth: 80,
        alignItems: 'center',
    },
    slotText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    consultationCard: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    cardGradient: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    consultationTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    consultationTime: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
    },
    statusTag: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 2,
    },
    joinBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    joinBtnText: {
        color: '#3a005f',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelActionBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,82,82,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },
    smallIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    historyTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    historyTime: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    noDataText: {
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 14,
    },
    selectedSlotButton: {
        backgroundColor: '#FF6B3D',
        borderColor: '#FF6B3D',
    },
    selectedSlotText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    bookNowBtn: {
        marginTop: 15,
        borderRadius: 12,
        overflow: 'hidden',
    },
    bookNowGradient: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    bookNowText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default VideoConsultationScreen;
