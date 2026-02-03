import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import ExerciseLibraryScreen from '../screens/exercise/ExerciseLibraryScreen';
import WorkoutDetailsScreen from '../screens/exercise/WorkoutDetailsScreen';
import CoachingScreen from '../screens/exercise/CoachingScreen';
import VideoConsultationScreen from '../screens/exercise/VideoConsultationScreen';

const Stack = createNativeStackNavigator();

const ExerciseNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} />
            <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} />
            <Stack.Screen name="Coaching" component={CoachingScreen} />
            <Stack.Screen name="VideoConsultation" component={VideoConsultationScreen} />
        </Stack.Navigator>
    );
};

export default ExerciseNavigator;
