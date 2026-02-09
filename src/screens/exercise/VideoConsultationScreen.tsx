import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
// Simplified calendar data
const DATES = Array.from({ length: 30 }, (_, i) => i + 1);

const VideoConsultationScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [selectedDate, setSelectedDate] = useState(5);

    const renderCalendar = () => (
        <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
                <TouchableOpacity><Ionicons name="chevron-back" size={20} color="#fff" /></TouchableOpacity>
                <Text style={styles.monthTitle}>October 2024</Text>
                <TouchableOpacity><Ionicons name="chevron-forward" size={20} color="#fff" /></TouchableOpacity>
            </View>

            <View style={styles.daysRow}>
                {DAYS.map((day, index) => (
                    <Text key={index} style={styles.dayLabel}>{day}</Text>
                ))}
            </View>

            <View style={styles.datesGrid}>
                {DATES.map((date) => (
                    <TouchableOpacity
                        key={date}
                        style={[styles.dateCell, selectedDate === date && styles.selectedDateCell]}
                        onPress={() => setSelectedDate(date)}
                    >
                        <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>{date}</Text>
                        {date === 5 && <View style={styles.dot} />}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#1a0033', '#3a005f']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Video Consultations</Text>
                <View style={{ width: 36 }} />

            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderCalendar()}

                {/* Simple Secondary Calendar for visual effect (Next Month) */}
                <View style={styles.calendarHeaderSimple}>
                    <Text style={styles.monthTitle}>November 2024</Text>
                    <Ionicons name="chevron-forward" size={16} color="#aaa" />
                </View>
                <View style={styles.daysRowSimple}>
                    {DAYS.map((day, index) => (
                        <Text key={index} style={styles.dayLabel}>{day}</Text>
                    ))}
                </View>
                {/* Just one row of dates for November preview */}
                <View style={styles.datesGrid}>
                    {[1, 2, 3, 4, 5, 6, 7].map((date) => (
                        <TouchableOpacity key={date} style={styles.dateCell}>
                            <Text style={styles.dateText}>{date}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Upcoming</Text>
                <View style={styles.consultationCard}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="videocam" size={20} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.consultationTitle}>Nutrition Consultation</Text>
                        <Text style={styles.consultationTime}>10:00 AM - 10:20 AM</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Past</Text>
                <View style={styles.consultationCard}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="videocam" size={20} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.consultationTitle}>Workout Consultation</Text>
                        <Text style={styles.consultationTime}>10:00 AM - 10:30 AM</Text>
                    </View>
                </View>
                <View style={styles.consultationCard}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="videocam" size={20} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.consultationTitle}>Habit Consultation</Text>
                        <Text style={styles.consultationTime}>10:00 AM - 10:30 AM</Text>
                    </View>
                </View>
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
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    calendarContainer: {
        marginBottom: 30,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    monthTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dayLabel: {
        color: '#ccc',
        fontSize: 12,
        width: (Dimensions.get('window').width - 40) / 7,
        textAlign: 'center',
    },
    datesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dateCell: {
        width: (Dimensions.get('window').width - 40) / 7,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        borderRadius: 20,
    },
    selectedDateCell: {
        backgroundColor: '#5e35b1',
    },
    dateText: {
        color: '#fff',
        fontSize: 14,
    },
    selectedDateText: {
        fontWeight: 'bold',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ffb74d',
        position: 'absolute',
        bottom: 5,
    },
    calendarHeaderSimple: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    daysRowSimple: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 20,
    },
    consultationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    consultationTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    consultationTime: {
        color: '#aaa',
        fontSize: 12,
    },
});
export default VideoConsultationScreen;
