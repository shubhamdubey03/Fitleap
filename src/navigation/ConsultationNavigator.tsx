import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import CoachingScreen from '../screens/exercise/CoachingScreen';
import VideoConsultationScreen from '../screens/exercise/VideoConsultationScreen';

const Stack = createNativeStackNavigator();

const ConsultationNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="CoachingHome" component={CoachingScreen} />
            <Stack.Screen name="VideoConsultation" component={VideoConsultationScreen} />
        </Stack.Navigator>
    );
};

export default ConsultationNavigator;
