import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin, reset } from '../redux/authSlice';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1010168078163-mllikqhguodcbl7fvaapo53kmhmobg3r.apps.googleusercontent.com', // Use Web Client ID (client_type 3 from google-services.json)
      offlineAccess: true,
      forceCodeForRefreshToken: true, // often needed to get idToken reliably
    });

    // When user lands on Home, forcefully delete any stale token data 
    // to prevent unwanted auto-login bugs from lingering sessions
    const clearStaleAuth = async () => {
      try {
        await AsyncStorage.removeItem('token');
        dispatch(reset());
      } catch (e) {
        console.log("Cleanup error:", e);
      }
    };
    clearStaleAuth();
  }, [dispatch]);

  const isFocused = useIsFocused();

  // React.useEffect(() => {
  //   if (isError && isFocused) {
  //     Alert.alert('Error', message);
  //     dispatch(reset());
  //   }



  //   if (isSuccess && user && isFocused) {
  //     if (user.token) {
  //       const handleSuccess = async () => {
  //         Alert.alert('Login Successful', `Welcome ${user.name}`);
  //         await AsyncStorage.setItem('IS_LOGGED_IN', 'true');
  //         await AsyncStorage.setItem('USER_ROLE', user.role);

  //         if (user.role === 'vendor' || user.role === 'Vendor') {
  //           const vendorName = user.name || 'Vendor';
  //           await AsyncStorage.setItem('VENDOR_NAME', vendorName);
  //           navigation.replace('VendorDashboard');
  //         } else if (user.role === 'coach' || user.role === 'Coach') {
  //           const coachName = user.name || 'Coach';
  //           await AsyncStorage.setItem('COACH_NAME', coachName);
  //           navigation.replace('CoachDashboard');
  //         } else {
  //           navigation.replace('Dashboard');
  //         }
  //         dispatch(reset());
  //       };
  //       handleSuccess();
  //     } else {
  //       // Successful signup/action but no token (e.g., pending approval)
  //       // Reset state so we don't trigger this again on focus
  //       dispatch(reset());
  //     }
  //   }
  // }, [isError, isSuccess, user, message, navigation, dispatch, isFocused]);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore error if user wasn't signed in
      }
      const userInfo = await GoogleSignin.signIn();
      console.log('Full User Info:', JSON.stringify(userInfo, null, 2));
      const idToken = userInfo.data?.idToken || userInfo.idToken;

      if (idToken) {
        console.log('GOOGLE ID TOKEN FOR POSTMAN:', idToken);
        dispatch(googleLogin(idToken));
      } else {
        Alert.alert('Error', 'Failed to get ID Token from Google');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play services not available');
      } else {
        console.error('Google Sign-In Error Details:', JSON.stringify(error, null, 2));
        Alert.alert('Error', 'Google Sign-In Error: ' + (error.message || 'Unknown error'));
      }
    }
  };

  return (
    <LinearGradient
      colors={['#1a0033', '#3b014f', '#5a015a']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}>Let’s Get You In</Text>

        {/* Google Button */}
        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin}>
          <View style={styles.googleCircle}>
            <Image
              source={require('../assets/images/google.png')}
              style={styles.googleIcon}
            />
          </View>

          <Text style={styles.btnText}>Continue With Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => navigation.navigate('StudentLogin')}
        >
          <View style={styles.googleCircle}>
            <Ionicons name="school-outline" size={22} color="#fff" />
          </View>
          <Text style={styles.btnText}>Continue as School Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => navigation.navigate('CollegeStudentLogin')}
        >
          <View style={styles.googleCircle}>
            <Ionicons name="business-outline" size={22} color="#fff" />
          </View>
          <Text style={styles.btnText}>Continue as College Student</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or</Text>

        {/* Sign Up */}
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>I already have an account</Text>

          <TouchableOpacity style={styles.loginRow} onPress={() => navigation.navigate('Login')}>
            <Image
              source={require('../assets/images/arrow.png')}
              style={styles.arrowIcon}
            />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  btnText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  optionBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
  orText: {
    color: '#ddd',
    textAlign: 'center',
    marginVertical: 18,
  },
  signupBtn: {
    backgroundColor: '#1b003d',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  signupText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  loginRow: {
    backgroundColor: '#000',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    color: '#fff',
    marginRight: 10,
    fontSize: 14,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 14,
  },

  googleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  googleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
});

export default HomeScreen;
