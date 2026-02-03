import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EXERCISES = [
    { id: '1', name: 'Squats', sets: '3 sets - 10 reps', icon: 'body' },
    { id: '2', name: 'Push-ups', sets: '3 sets - 12 reps', icon: 'fitness' },
    { id: '3', name: 'Lunges', sets: '3 sets - 15 reps', icon: 'walk' },
    { id: '4', name: 'Plank', sets: '3 sets - 12 reps', icon: 'time-outline' },
    { id: '5', name: 'Bicycle Crunches', sets: '3 sets - 15 reps', icon: 'bicycle' },
];

const WorkoutDetailsScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { workout } = route.params || {
        workout: {
            title: 'Full Body Strength',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600'
        }
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
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image source={{ uri: workout.image }} style={styles.heroImage} />
                </View>

                <Text style={styles.title}>{workout.title}</Text>
                <Text style={styles.description}>
                    This workout targets all major muscle groups for a comprehensive strength training session.
                </Text>

                <Text style={styles.sectionTitle}>Exercises</Text>

                {/* Exercise List */}
                <View style={styles.exerciseList}>
                    {EXERCISES.map((item) => (
                        <View key={item.id} style={styles.exerciseItem}>
                            <View style={styles.iconBox}>
                                <Ionicons name={item.icon} size={20} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.exerciseName}>{item.name}</Text>
                                <Text style={styles.exerciseSets}>{item.sets}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Instructions */}
                <Text style={styles.sectionTitle}>Instructions</Text>
                <Text style={styles.description}>
                    Perform each exercise with proper form. Rest for 60 seconds between sets. Watch the video library for demonstrations.
                </Text>

                <TouchableOpacity
                    style={styles.startBtn}
                    onPress={() => alert('Workout Started!')}
                >
                    <Text style={styles.startBtnText}>Start Workout</Text>
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
