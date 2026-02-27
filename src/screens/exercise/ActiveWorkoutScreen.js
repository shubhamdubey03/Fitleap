import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../redux/authSlice';

const ActiveWorkoutScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { workout } = route.params;

    const [seconds, setSeconds] = useState(Number(workout.time) * 60);
    const [isActive, setIsActive] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
        } else if (!isActive || seconds === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCancel = () => {
        Alert.alert(
            "Cancel Workout",
            "Are you sure you want to cancel your workout? Progress will not be saved.",
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: () => navigation.goBack(), style: "destructive" }
            ]
        );
    };

    const handleComplete = async () => {
        if (!workout.id) {
            Alert.alert("Error", "Workout ID missing.");
            return;
        }

        try {
            setCompleting(true);
            setIsActive(false);
            console.log("workout", workout);
            const response = await axios.put(
                `${API_BASE_URL}/workouts/${workout.id}`,
                {
                    workout_id: workout.id,
                    status: 'completed',
                    coins: workout.coin
                },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                }
            );
            console.log("response", response);

            if (response.status === 200) {
                // Refresh user profile to update wallet balance
                dispatch(getProfile());

                Alert.alert(
                    "Workout Completed!",
                    `Great job! You've earned ${workout.coin} coins.`,
                    [
                        { text: "Awesome", onPress: () => navigation.popToTop() }
                    ]
                );
            }
        } catch (error) {
            console.error('Complete Workout Error:', error);
            Alert.alert("Error", "Failed to save workout progress.");
        } finally {
            setCompleting(false);
        }
    };

    const togglePause = () => {
        setIsActive(!isActive);
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3a005f']}
            style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}
        >
            {/* Header / Cancel */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Active Workout</Text>
                <View style={{ width: 50 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.workoutInfo}>
                    <Text style={styles.workoutName}>{workout.name || workout.title}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="flash-outline" size={24} color="#ffb74d" />
                            <Text style={styles.statValue}>{workout.coin} Coins</Text>
                        </View>
                        <View style={[styles.statItem, { marginLeft: 20 }]}>
                            <Ionicons name="time-outline" size={24} color="#4fc3f7" />
                            <Text style={styles.statValue}>{workout.time} Mins</Text>
                        </View>
                    </View>
                </View>

                {/* Timer Display */}
                <View style={styles.timerContainer}>
                    <View style={styles.timerCircle}>
                        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
                        <Text style={styles.timerLabel}>{isActive ? 'REMAINING' : 'PAUSED'}</Text>
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.controlBtn, styles.pauseBtn]}
                        onPress={togglePause}
                    >
                        <Ionicons
                            name={isActive ? "pause" : "play"}
                            size={32}
                            color="#fff"
                        />
                        <Text style={styles.btnText}>{isActive ? 'Pause' : 'Resume'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.controlBtn, styles.completeBtn]}
                        onPress={handleComplete}
                        disabled={completing}
                    >
                        {completing ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-done" size={32} color="#fff" />
                                <Text style={styles.btnText}>Mark as Completed</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
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
    cancelText: {
        color: '#ff5252',
        fontSize: 16,
        fontWeight: '600',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    workoutInfo: {
        alignItems: 'center',
    },
    workoutName: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    timerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 8,
        borderColor: '#5e35b1',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(94, 53, 177, 0.1)',
    },
    timerText: {
        color: '#fff',
        fontSize: 60,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    timerLabel: {
        color: '#aaa',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        letterSpacing: 2,
    },
    controls: {
        width: '100%',
        gap: 15,
    },
    controlBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    pauseBtn: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    completeBtn: {
        backgroundColor: '#5e35b1',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default ActiveWorkoutScreen;
