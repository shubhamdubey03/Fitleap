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
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin, reset } from '../redux/authSlice';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const HomeScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1010168078163-cu8oa0roarn1dup7krir12iviik5hs80.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  React.useEffect(() => {
    if (isError) {
      Alert.alert('Error', message);
      dispatch(reset());
    }

    if (isSuccess && user) {
      const handleSuccess = async () => {
        Alert.alert('Success', 'Logged in with Google');
        await AsyncStorage.setItem('IS_LOGGED_IN', 'true');
        await AsyncStorage.setItem('USER_ROLE', user.role);

        if (user.role === 'vendor' || user.role === 'Vendor') {
          const vendorName = user.name || 'Vendor';
          await AsyncStorage.setItem('VENDOR_NAME', vendorName);
          navigation.replace('VendorDashboard');
        } else if (user.role === 'coach' || user.role === 'Coach') {
          const coachName = user.name || 'Coach';
          await AsyncStorage.setItem('COACH_NAME', coachName);
          navigation.replace('CoachDashboard');
        } else {
          navigation.replace('Dashboard');
        }
        dispatch(reset());
      };
      handleSuccess();
    }
  }, [isError, isSuccess, user, message, navigation, dispatch]);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

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
        console.error(error);
        Alert.alert('Error', 'Google Sign-In Error: ' + error.message);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#1a0033', '#3a005f', '#6a006a']}
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
        {/* College */}
        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => navigation.navigate('CollegeStudentLogin')}
        >
          <Text style={styles.optionText}>Continue As College Student</Text>
        </TouchableOpacity>

        {/* School */}
        <TouchableOpacity style={styles.optionBtn}
          onPress={() => navigation.navigate('StudentLogin')}>
          <Text style={styles.optionText}>Continue As School Student</Text>
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
