import React, { useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const AddHabitScreen = ({ navigation }) => {
    const [habitName, setHabitName] = useState('');
    const [frequency, setFrequency] = useState('Daily');

    const [reminders, setReminders] = useState({
        morning: true,
        afternoon: true,
        evening: true,
    });

    const [selectedColor, setSelectedColor] = useState('cyan');

    const toggleReminder = (key) => {
        setReminders(prev => ({ ...prev, [key]: !prev[key] }));
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
                    <Text style={styles.headerTitle}>Add Habit</Text>
                    <View style={styles.coinIcon}>
                        <View style={styles.coinInner} />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

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
                        {['Daily', 'Weekly', 'Monthly'].map((opt) => (
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

                    <View style={styles.reminderRow}>
                        <View>
                            <Text style={styles.reminderLabel}>Morning</Text>
                            <Text style={styles.reminderTime}>8:00 AM</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }} // Light blue/white active track
                            thumbColor={reminders.morning ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleReminder('morning')}
                            value={reminders.morning}
                        />
                    </View>

                    <View style={styles.reminderRow}>
                        <View>
                            <Text style={styles.reminderLabel}>Afternoon</Text>
                            <Text style={styles.reminderTime}>12:00 PM</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={reminders.afternoon ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleReminder('afternoon')}
                            value={reminders.afternoon}
                        />
                    </View>

                    <View style={styles.reminderRow}>
                        <View>
                            <Text style={styles.reminderLabel}>Evening</Text>
                            <Text style={styles.reminderTime}>6:00 PM</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={reminders.evening ? "#f4f3f4" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleReminder('evening')}
                            value={reminders.evening}
                        />
                    </View>


                    {/* Icon / Color Picker */}
                    <Text style={styles.sectionTitle}>Icon</Text>
                    <View style={styles.colorRow}>
                        {['#0055FF', '#330099', '#00CCFF', '#9900CC', '#FF00CC'].map((color, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.colorSelected]}
                                onPress={() => setSelectedColor(color)}
                            >
                                {selectedColor === color && <View style={styles.whiteRing} />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Add Button */}
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addButtonText}>Add Habit</Text>
                    </TouchableOpacity>

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
    coinIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#B8860B',
    },
    coinInner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
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
    colorRow: {
        flexDirection: 'row',
        marginBottom: 40,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    whiteRing: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#fff',
        position: 'absolute',
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
});

export default AddHabitScreen;
