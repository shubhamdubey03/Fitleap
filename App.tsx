/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/HomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import CollegeStudentLogin from './src/screens/CollegeStudentLogin';
import StudentLogin from './src/screens/StudentLogin';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/components/dashboard/DashboardScreen';
import VendorDashboard from './src/screens/VendorDashboard';
import CoachDashboard from './src/screens/CoachDashboard';
import CaloriesScreen from './src/components/dashboard/CaloriesScreen';
import SettingsScreen from './src/components/setting/SettingsScreen';
import FeedbackProgressScreen from './src/components/setting/FeedbackProgressScreen';
import EventsRewardsScreen from './src/components/setting/EventsRewardsScreen';
import ReportIssueScreen from './src/components/setting/ReportIssueScreen';
import HelpCenterScreen from './src/components/setting/HelpCenterScreen';
import NotificationScreen from './src/components/dashboard/NotificationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] =useState<string | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('IS_LOGGED_IN');
        const userData = await AsyncStorage.getItem('DUMMY_USER');

        if (isLoggedIn === 'true' && userData) {
          const user = JSON.parse(userData);

          if (user.role === 'User') {
            setInitialRoute('Dashboard');
          } else if (user.role === 'Vendor') {
            setInitialRoute('VendorDashboard');
          } else if (user.role === 'Coach') {
            setInitialRoute('CoachDashboard');
          } else {
            setInitialRoute('Home');
          }
        } else {
          setInitialRoute('Login');
        }
      } catch (e) {
        console.log('Auth error:', e);
        setInitialRoute('Login');
      }
    };

    checkAuth();
  }, []);

  // Splash / loading state
  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="CollegeStudentLogin" component={CollegeStudentLogin} />
        <Stack.Screen name="StudentLogin" component={StudentLogin} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="VendorDashboard" component={VendorDashboard} />
        <Stack.Screen name="CoachDashboard" component={CoachDashboard} />
        <Stack.Screen name="Calories" component={CaloriesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="FeedbackProgressScreen" component={FeedbackProgressScreen} />
        <Stack.Screen name="EventsRewardsScreen" component={EventsRewardsScreen} />
        <Stack.Screen name="ReportIssueScreen" component={ReportIssueScreen} />
        <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
