import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TextInput,
    Switch,
    Alert,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../config/api';

const AddHabitScreen = ({ navigation }) => {
    const { user } = useSelector((state) => state.auth);
    const [habitName, setHabitName] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [loading, setLoading] = useState(false);
    const [habits, setHabits] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null); // track which habit is being edited

    const [reminders, setReminders] = useState({
        morning: true,
        afternoon: true,
        evening: true,
    });

    const toggleReminder = (key) => {
        setReminders(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            // console.log("New reminders state:", newState);
            return newState;
        });
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        setFetching(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/habits`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                setHabits(response.data.data);
            }
        } catch (error) {
            console.error('Fetch habits error:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleDeleteHabit = async (id) => {
        Alert.alert(
            'Delete Habit',
            'Are you sure you want to delete this habit?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await axios.delete(`${API_BASE_URL}/habits/${id}`, {
                                headers: { Authorization: `Bearer ${user.token}` }
                            });
                            if (response.data.success) {
                                fetchHabits();
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete habit');
                        }
                    }
                }
            ]
        );
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        try {
            const response = await axios.patch(`${API_BASE_URL}/habits/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            if (response.data.success) {
                fetchHabits();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const handleAddHabit = async () => {
        if (!habitName.trim()) {
            Alert.alert('Validation Error', 'Habit name is missing! Please fill in the habit name.');
            return;
        }

        if (!frequency) {
            Alert.alert('Validation Error', 'Frequency is missing! Please select a frequency.');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (editingHabit) {
                // Update existing habit
                response = await axios.put(`${API_BASE_URL}/habits/${editingHabit.id}`, {
                    habit_name: habitName,
                    frequency: frequency,
                    is_morning: Boolean(reminders.morning),
                    is_afternoon: Boolean(reminders.afternoon),
                    is_evening: Boolean(reminders.evening),
                    reminder_datetime: new Date().toISOString()
                }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            } else {
                // Create new habit
                response = await axios.post(`${API_BASE_URL}/habits`, {
                    habit_name: habitName,
                    frequency: frequency,
                    is_morning: Boolean(reminders.morning),
                    is_afternoon: Boolean(reminders.afternoon),
                    is_evening: Boolean(reminders.evening),
                    reminder_datetime: new Date().toISOString()
                }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }

            if (response.data.success) {
                Alert.alert('Success', editingHabit ? 'Habit updated successfully' : 'Habit added successfully');
                setHabitName('');
                setEditingHabit(null);
                setReminders({
                    morning: true,
                    afternoon: true,
                    evening: true,
                });
                fetchHabits();
            } else {
                Alert.alert('Error', response.data.message || 'Failed to process habit');
            }
        } catch (error) {
            console.error('Habit process error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleEditPress = (habit) => {

        setEditingHabit(habit);
        setHabitName(habit.habit_name);
        setFrequency(habit.frequency);
        setReminders({
            morning: !!habit.is_morning,
            afternoon: !!habit.is_afternoon,
            evening: !!habit.is_evening,
        });
        // Scroll to top
        // This would require a ref to ScrollView, let's keep it simple for now
    };

    const cancelEdit = () => {
        setEditingHabit(null);
        setHabitName('');
        setFrequency('daily');
        setReminders({
            morning: true,
            afternoon: true,
            evening: true,
        });
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3b0a57', '#6a0f6b']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{editingHabit ? 'Edit Habit' : 'Add Habit'}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {editingHabit && (
                        <View style={styles.editingBanner}>
                            <Text style={styles.editingText}>Editing: {editingHabit.habit_name}</Text>
                            <TouchableOpacity onPress={cancelEdit}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Habit Name Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Habit name"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            value={habitName}
                            onChangeText={setHabitName}
                        />
                    </View>

                    {/* Frequency */}
                    <Text style={styles.sectionTitle}>Frequency</Text>
                    <View style={styles.frequencyContainer}>
                        {['daily', 'weekly', 'monthly'].map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.freqOption, frequency === opt && styles.freqOptionSelected]}
                                onPress={() => setFrequency(opt)}
                            >
                                <Text style={[styles.freqText, frequency === opt && styles.freqTextSelected]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Reminders */}
                    <Text style={styles.sectionTitle}>Reminders</Text>

                    {[
                        { key: 'morning', label: 'Morning', time: '8:00 AM' },
                        { key: 'afternoon', label: 'Afternoon', time: '12:00 PM' },
                        { key: 'evening', label: 'Evening', time: '6:00 PM' },
                    ].map((item) => (
                        <View key={item.key} style={styles.reminderRow}>
                            <View>
                                <Text style={styles.reminderLabel}>{item.label}</Text>
                                <Text style={styles.reminderTime}>{item.time}</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={reminders[item.key] ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleReminder(item.key)}
                                value={!!reminders[item.key]}
                            />
                        </View>
                    ))}


                    {/* Add Button */}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddHabit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.addButtonText}>{editingHabit ? 'Update Habit' : 'Add Habit'}</Text>
                        )}
                    </TouchableOpacity>

                    {/* Habits List */}
                    <View style={styles.habitsListContainer}>
                        <Text style={styles.sectionTitle}>Your Habits</Text>
                        {fetching ? (
                            <ActivityIndicator color="#fff" />
                        ) : habits.length > 0 ? (
                            habits.map((item) => (
                                <View key={item.id} style={styles.habitItem}>
                                    <View style={styles.habitInfo}>
                                        <TouchableOpacity onPress={() => handleToggleStatus(item.id, item.status)}>
                                            <Ionicons
                                                name={item.status === 'completed' ? "checkmark-circle" : "ellipse-outline"}
                                                size={24}
                                                color={item.status === 'completed' ? "#4caf50" : "#fff"}
                                            />
                                        </TouchableOpacity>
                                        <View style={styles.habitTextContainer}>
                                            <Text style={[styles.habitName, item.status === 'completed' && styles.habitTextCompleted]}>
                                                {item.habit_name}
                                            </Text>
                                            <Text style={styles.habitFreq}>{item.frequency}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity onPress={() => handleEditPress(item)} style={styles.actionBtn}>
                                            <Ionicons name="create-outline" size={20} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteHabit(item.id)} style={styles.actionBtn}>
                                            <Ionicons name="trash-outline" size={20} color="#ff4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No habits added yet.</Text>
                        )}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 50,
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'serif',
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    inputContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 25,
        height: 50,
        justifyContent: 'center',
    },
    input: {
        color: '#fff',
        fontSize: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    frequencyContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    freqOption: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 8,
        marginRight: 15,
    },
    freqOptionSelected: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: '#fff',
    },
    freqText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    freqTextSelected: {
        color: '#fff',
    },
    reminderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    reminderLabel: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4,
    },
    reminderTime: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    addButton: {
        backgroundColor: '#3b0a57',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    habitsListContainer: {
        marginTop: 10,
        paddingBottom: 40,
    },
    habitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
    },
    habitInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    habitTextContainer: {
        marginLeft: 12,
    },
    habitName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    habitTextCompleted: {
        textDecorationLine: 'line-through',
        color: 'rgba(255,255,255,0.5)',
    },
    habitFreq: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        textTransform: 'capitalize',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        padding: 5,
        marginLeft: 10,
    },
    editingBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 10, 87, 0.5)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    editingText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    cancelText: {
        color: '#ff4444',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default AddHabitScreen;
