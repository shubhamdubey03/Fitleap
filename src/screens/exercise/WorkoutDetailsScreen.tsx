import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// const EXERCISES = [
//     { id: '1', name: 'Squats', sets: '3 sets - 10 reps', icon: 'body', coin: 10, time: 5 },
//     { id: '2', name: 'Push-ups', sets: '3 sets - 12 reps', icon: 'fitness', coin: 15, time: 8 },
//     { id: '3', name: 'Lunges', sets: '3 sets - 15 reps', icon: 'walk', coin: 12, time: 6 },
//     { id: '4', name: 'Plank', sets: '3 sets - 12 reps', icon: 'time-outline', coin: 20, time: 10 },
//     { id: '5', name: 'Bicycle Crunches', sets: '3 sets - 15 reps', icon: 'bicycle', coin: 18, time: 9 },
// ];

const WorkoutDetailsScreen = ({ navigation, route }: any) => {
    const insets = useSafeAreaInsets();
    const { workout: initialWorkout } = route.params;

    const [workout, setWorkout] = useState<any>(initialWorkout);
    const [loading, setLoading] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<any>(initialWorkout);

    useEffect(() => {
        const fetchWorkoutDetails = async () => {
            if (!initialWorkout?.id) return;
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/workouts/${initialWorkout.id}`);
                if (response.data?.data) {
                    const fetchedWorkout = response.data.data;
                    setWorkout(fetchedWorkout);
                    setSelectedExercise({
                        id: fetchedWorkout.id,
                        name: fetchedWorkout.name,
                        sets: '3 sets - 10 reps',
                        icon: 'body',
                        coin: fetchedWorkout.coin,
                        time: fetchedWorkout.time
                    });
                }
            } catch (error) {
                console.error('Fetch Workout Details Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkoutDetails();
    }, [initialWorkout?.id]);

    const handleStart = () => {
        navigation.navigate('ActiveWorkout', {
            workout: {
                ...selectedExercise,
                title: selectedExercise?.name || workout?.name,
                image: workout?.image_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600'
            }
        });
    };

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
                <Text style={styles.headerTitle}>Workout Details</Text>
                <TouchableOpacity>
                    <View style={styles.iconButton}>
                        <Ionicons name="star-outline" size={20} color="#ffb74d" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <View style={{ height: 200, justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#5e35b1" />
                    </View>
                ) : (
                    <>
                        {/* Hero Image */}
                        <View style={styles.heroContainer}>
                            <Image
                                source={{ uri: workout.image_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600' }}
                                style={styles.heroImage}
                            />
                        </View>

                        <Text style={styles.title}>{workout.name}</Text>
                        <Text style={styles.description}>
                            This workout targets all major muscle groups for a comprehensive strength training session. {workout.time ? `\nDuration: ${workout.time} mins • Rewards: ${workout.coin} Coins` : ''}
                        </Text>
                    </>
                )}

                <Text style={styles.sectionTitle}>Select an Exercise</Text>

                {/* Exercise List */}
                <View style={styles.exerciseList}>
                    {[
                        {
                            id: workout.id?.toString() || '1',
                            name: workout.name || workout.title || 'Exercise',
                            sets: '3 sets - 10 reps',
                            icon: 'body',
                            coin: workout.coin,
                            time: workout.time
                        }
                    ].map((item) => {
                        const isSelected = selectedExercise?.id?.toString() === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.exerciseItem,
                                    isSelected && styles.selectedExerciseItem
                                ]}
                                onPress={() => setSelectedExercise(item as any)}
                            >
                                <View style={[styles.iconBox, isSelected && styles.selectedIconBox]}>
                                    <Ionicons name={item.icon as any} size={20} color={isSelected ? "#1a0033" : "#fff"} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.exerciseName}>{item.name}</Text>
                                    <Text style={styles.exerciseSets}>{item.sets}</Text>
                                </View>
                                {isSelected && (
                                    <Ionicons name="checkmark-circle" size={24} color="#5e35b1" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Instructions */}
                <Text style={styles.sectionTitle}>Instructions</Text>
                <Text style={styles.description}>
                    Perform the selected exercise with proper form. Each set has specific goals. Rest as needed.
                </Text>

                <TouchableOpacity
                    style={styles.startBtn}
                    onPress={handleStart}
                >
                    <Text style={styles.startBtnText}>Start {selectedExercise.name}</Text>
                </TouchableOpacity>
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
    heroContainer: {
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },
    exerciseList: {
        gap: 15,
        marginBottom: 20,
    },
    exerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedExerciseItem: {
        backgroundColor: 'rgba(94, 53, 177, 0.2)',
        borderColor: '#5e35b1',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    selectedIconBox: {
        backgroundColor: '#fff',
    },
    exerciseName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    exerciseSets: {
        color: '#aaa',
        fontSize: 12,
    },
    startBtn: {
        backgroundColor: '#5e35b1', // Deep purple
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    startBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default WorkoutDetailsScreen;
