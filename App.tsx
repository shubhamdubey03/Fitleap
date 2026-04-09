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
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import { setUser, loadUser } from './src/redux/authSlice';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import HomeScreen from './src/screens/HomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import CollegeStudentLogin from './src/screens/CollegeStudentLogin';
import StudentLogin from './src/screens/StudentLogin';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

import DashboardScreen from './src/components/dashboard/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MarketplaceNavigator from './src/navigation/MarketplaceNavigator';
import ExerciseStack from './src/navigation/ExerciseNavigator';
import ConsultationNavigator from './src/navigation/ConsultationNavigator';
import SettingsScreen from './src/components/setting/SettingsScreen';
import FeedbackProgressScreen from './src/components/setting/FeedbackProgressScreen';
import EventsRewardsScreen from './src/components/setting/EventsRewardsScreen';
// import ReportIssueScreen from './src/components/setting/ReportIssueScreen';
// import HelpCenterScreen from './src/components/setting/HelpCenterScreen';

import NotificationScreen from './src/components/dashboard/NotificationScreen';
import RecipesScreen from './src/components/dashboard/RecipesScreen';
import MealDetailsScreen from './src/components/dashboard/MealDetailsScreen';
import YourCoinsScreen from './src/components/dashboard/YourCoinsScreen';
import EditProfileScreen from './src/components/setting/EditProfileScreen';
import ProgramsAndChallengesScreen from './src/screens/ProgramsAndChallengesScreen';
import SubscriptionScreen from './src/components/setting/SubscriptionScreen';
import InvoiceHistoryScreen from './src/components/setting/InvoiceHistoryScreen';
import AddHabitScreen from './src/components/setting/AddHabitScreen';
import PaymentsAndBillsScreen from './src/components/setting/PaymentsAndBillsScreen';
import AddressScreen from './src/components/setting/AddressScreen';
import SavedAddressesScreen from './src/components/setting/SavedAddressesScreen';
import VendorDashboardScreen from './src/screens/VendorDashboardScreen';
import CoachDashboardScreen from './src/screens/CoachDashboardScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import InviteFriendScreen from './src/screens/InviteFriendScreen';
import VideoCallScreen from './src/screens/exercise/VideoCallScreen';
// import CoachAvailabilityScreen from './src/screens/CoachAvailabilityScreen';
import VideoConsultationScreen from './src/screens/exercise/VideoConsultationScreen';
import { initNotifications } from './src/services/Notifications';
import CoachFeedbackScreen from './src/screens/CoachFeedbackScreen';
import ProgramActiveScreen from './src/screens/ProgramActiveScreen';
import ProgramSubscriptionPlansScreen from './src/screens/ProgramSubscriptionPlansScreen';
import WaterIntakeScreen from './src/components/dashboard/WaterIntakeScreen';





const Stack = createNativeStackNavigator();

// Create a component that holds the main navigation logic
const MainNav = () => {
  const dispatch = useDispatch();
  // Fix: Explicitly type state as 'any' or define RootState interface
  const { user } = useSelector((state: any) => state.auth);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [isNotificationInit, setIsNotificationInit] = useState(false);

  useEffect(() => {
    if (!isNotificationInit) {
      if (user?.id || user?._id) {
        initNotifications(user.id || user._id);
      } else {
        initNotifications();
      }
      setIsNotificationInit(true);
    }
  }, [user]);
  useEffect(() => {
    dispatch(loadUser() as any);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('IS_LOGGED_IN');

        if (isLoggedIn === 'true') {
          // Restore user to Redux
          const userString = await AsyncStorage.getItem('user');
          if (userString) {
            const user = JSON.parse(userString);
            store.dispatch(setUser(user));
          }

          const userRole = await AsyncStorage.getItem('USER_ROLE');

          if (userRole === 'Vendor') {
            setInitialRoute('VendorDashboard');
          } else if (userRole === 'Coach') {
            setInitialRoute('CoachDashboard');
          } else {
            setInitialRoute('Dashboard');
          }
        } else {
          setInitialRoute('Home');
        }
      } catch (e) {
        console.log('Auth error:', e);
        setInitialRoute('Home');
      }
    };

    checkAuth();
  }, []);

  // Splash / loading state
  if (!initialRoute) return null;

  return (
    <KeyboardProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute!}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="CollegeStudentLogin" component={CollegeStudentLogin} />
          <Stack.Screen name="StudentLogin" component={StudentLogin} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Exercise" component={ExerciseStack} />
          <Stack.Screen name="Consultation" component={ConsultationNavigator} />
          <Stack.Screen name="Marketplace" component={MarketplaceNavigator} />
          <Stack.Screen name="Profile" component={ProfileScreen} />

          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="FeedbackProgressScreen" component={FeedbackProgressScreen} />
          <Stack.Screen name="EventsRewardsScreen" component={EventsRewardsScreen} />
          {/* <Stack.Screen name="ReportIssueScreen" component={ReportIssueScreen} /> */}
          {/* <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} /> */}
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="Recipes" component={RecipesScreen} />
          <Stack.Screen name="MealDetails" component={MealDetailsScreen} />
          <Stack.Screen name="YourCoins" component={YourCoinsScreen} />
          <Stack.Screen name="ProgramsAndChallenges" component={ProgramsAndChallengesScreen} />
          <Stack.Screen name="ProgramActive" component={ProgramActiveScreen} />
          <Stack.Screen name="ProgramSubscriptionPlans" component={ProgramSubscriptionPlansScreen} />
          <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />

          <Stack.Screen name="InvoiceHistoryScreen" component={InvoiceHistoryScreen} />
          <Stack.Screen name="AddHabitScreen" component={AddHabitScreen} />
          <Stack.Screen name="PaymentsAndBillsScreen" component={PaymentsAndBillsScreen} />
          <Stack.Screen name="YourCoinsScreen" component={YourCoinsScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="AddressScreen" component={AddressScreen} />
          <Stack.Screen name="SavedAddressesScreen" component={SavedAddressesScreen} />
          <Stack.Screen name="VendorDashboard" component={VendorDashboardScreen} />
          <Stack.Screen name="CoachDashboard" component={CoachDashboardScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ChatList" component={ChatListScreen} />

          <Stack.Screen name="InviteFriend" component={InviteFriendScreen} />
          <Stack.Screen name="VideoCall" component={VideoCallScreen} />
          {/* <Stack.Screen name="CoachAvailability" component={CoachAvailabilityScreen} /> */}
          <Stack.Screen name="VideoConsultation" component={VideoConsultationScreen} />
          <Stack.Screen name="CoachFeedback" component={CoachFeedbackScreen} />
          <Stack.Screen name="WaterIntake" component={WaterIntakeScreen} />


        </Stack.Navigator>
      </NavigationContainer>
    </KeyboardProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <MainNav />
    </Provider>
  );
}
