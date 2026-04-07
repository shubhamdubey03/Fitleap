import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    scheduleWaterReminder, 
    cancelWaterReminders,
    syncWaterReminderStatus 
} from '../../services/Notifications';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const WaterIntakeScreen = ({ navigation }) => {
    const [glasses, setGlasses] = useState(0);
    const [goal, setGoal] = useState(10);
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Today'); // 'Today' or 'Tomorrow'
    const { user } = useSelector((state) => state.auth);
    const userId = user?.id || user?._id;

    useEffect(() => {
        loadData();
    }, [selectedDay]);

    const getDateKey = (day) => {
        const date = new Date();
        if (day === 'Tomorrow') {
            date.setDate(date.getDate() + 1);
        }
        return `water_intake_${date.toISOString().split('T')[0]}`;
    };

    const loadData = async () => {
        try {
            const key = getDateKey(selectedDay);
            const savedGlasses = await AsyncStorage.getItem(key);
            setGlasses(savedGlasses !== null ? parseInt(savedGlasses) : 0);
            
            const savedReminder = await AsyncStorage.getItem('water_reminder_enabled');
            setReminderEnabled(savedReminder === 'true');
        } catch (e) {
            console.error(e);
        }
    };

    const updateGlasses = async (val) => {
        const newVal = Math.max(0, glasses + val);
        setGlasses(newVal);
        const key = getDateKey(selectedDay);
        await AsyncStorage.setItem(key, newVal.toString());
        
        // If they added water (+1) and reminders are enabled, reset the timer 
        if (val > 0 && reminderEnabled) {
            await scheduleWaterReminder(2);
        }
    };


    const toggleReminder = async () => {
        const newState = !reminderEnabled;
        setReminderEnabled(newState);
        await AsyncStorage.setItem('water_reminder_enabled', newState.toString());
        
        // 👉 Sync setting to Database for Backend Cron
        if (userId) {
            await syncWaterReminderStatus(userId, newState);
        }

        if (newState) {
            await scheduleWaterReminder(2); // Every 2 hours
        } else {
            await cancelWaterReminders();
        }
    };

    return (
        <LinearGradient colors={['#1a0033', '#3b014f', '#5a015a']} style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Water Intake</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Progress Status */}
                <View style={styles.progressSection}>
                    <View style={styles.dateTabs}>
                        <TouchableOpacity 
                            onPress={() => setSelectedDay('Today')}
                            style={[styles.dateTab, selectedDay === 'Today' && styles.activeDateTab]}
                        >
                            <Text style={[styles.dateTabText, selectedDay === 'Today' && styles.activeDateTabText]}>Today</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setSelectedDay('Tomorrow')}
                            style={[styles.dateTab, selectedDay === 'Tomorrow' && styles.activeDateTab]}
                        >
                            <Text style={[styles.dateTabText, selectedDay === 'Tomorrow' && styles.activeDateTabText]}>Tomorrow</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.glassesCount}>
                        <Text style={styles.bold}>{glasses}</Text> of {goal} Glasses
                    </Text>
                    
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${Math.min((glasses / goal) * 100, 100)}%` }]} />
                    </View>
                </View>

                {/* Main Interactive Area */}
                <View style={styles.mainInteraction}>
                    <TouchableOpacity 
                        style={styles.circleButton} 
                        onPress={() => updateGlasses(-1)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="remove" size={32} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.glassContainer}>
                         <View style={styles.glassCircle}>
                            <View style={styles.innerGlassCircle}>
                                <Ionicons name="water" size={60} color="#2196F3" />
                            </View>
                         </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.circleButton, { backgroundColor: '#2196F3' }]} 
                        onPress={() => updateGlasses(1)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="add" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.unitText}>1 Glass (250 ml)</Text>

                {/* Reminder Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Ionicons name="notifications-outline" size={20} color="#fff" />
                            <Text style={styles.cardTitle}>Reminder</Text>
                        </View>
                        <TouchableOpacity onPress={toggleReminder}>
                            <Text style={[styles.editText, { color: reminderEnabled ? '#00E676' : '#FF6B3D' }]}>
                                {reminderEnabled ? 'ENABLED' : 'DISABLED'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Today's Tip */}
                <View style={[styles.card, styles.tipCard]}>
                    <Text style={[styles.cardTitle, { marginBottom: 15 }]}>Today's Tip</Text>
                    <View style={styles.tipContent}>
                        <View style={styles.tipIconBg}>
                            <Ionicons name="water-outline" size={24} color="#2196F3" />
                        </View>
                        <Text style={styles.tipText}>
                            When traveling by plane, stay hydrated by drinking lots of water and avoiding alcohol and salty foods.
                        </Text>
                    </View>
                </View>

                {/* Daily Water Intake Graph */}
                <View style={styles.card}>
                   <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Daily Water Intake</Text>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>Last 7 days</Text>
                   </View>
                   <View style={styles.graphPlaceholder}>
                        <View style={styles.graphLine} />
                        <View style={styles.graphPoints}>
                            {[10, 10, 10, 10, 10, 10, 10].map((v, i) => (
                                <View key={i} style={styles.pointWrapper}>
                                    <Text style={styles.pointValue}>{v}</Text>
                                    <View style={styles.point} />
                                </View>
                            ))}
                        </View>
                   </View>
                </View>

            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    progressSection: { alignItems: 'center', marginVertical: 20 },
    dateTabs: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 5,
        marginBottom: 20,
    },
    dateTab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 15,
    },
    activeDateTab: {
        backgroundColor: '#fff',
    },
    dateTabText: {
        color: '#ccc',
        fontSize: 16,
        fontWeight: '500',
    },
    activeDateTabText: {
        color: '#1a0033',
    },
    glassesCount: { color: '#fff', fontSize: 24, marginBottom: 20 },

    bold: { fontWeight: 'bold', fontSize: 36 },
    progressBarBg: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2196F3',
        borderRadius: 4,
    },
    mainInteraction: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
        gap: 30,
    },
    circleButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    glassContainer: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glassCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerGlassCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unitText: { color: '#fff', textAlign: 'center', marginBottom: 40, fontSize: 18, fontWeight: '500' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    cardTitle: { color: '#333', fontSize: 18, fontWeight: '600' },
    editText: { fontWeight: 'bold', color: '#2196F3' },
    tipCard: { },
    tipContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    tipIconBg: {
        width: 50,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 5,
    },
    tipText: { color: '#444', flex: 1, fontSize: 15, lineHeight: 22 },
    graphPlaceholder: { 
        height: 120, 
        marginTop: 20,
        justifyContent: 'center',
    },
    graphLine: {
        height: 1,
        backgroundColor: '#F5C542',
        width: '100%',
        position: 'absolute',
        top: '60%',
    },
    graphPoints: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
    },
    pointWrapper: {
        alignItems: 'center',
    },
    pointValue: {
        fontSize: 10,
        color: '#444',
        marginBottom: 15,
    },
    point: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#2196F3',
    }
});

export default WaterIntakeScreen;
