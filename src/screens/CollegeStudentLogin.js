import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { login, setUser } from '../redux/authSlice';
import axios from 'axios';
import { AUTH_URL } from '../config/api';

const CollegeStudentLogin = ({ navigation }) => {
  const [secure, setSecure] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (isLoading) return;
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const userData = {
      email: trimmedEmail,
      password: trimmedPassword,
    };
    setIsLoading(true);

    dispatch(login(userData))
      .unwrap()
      .then(async (response) => {
        if (response.requireOtp) {
          setShowOtpInput(true);
          Alert.alert('Verification', response.message || 'OTP sent to your email.');
          return;
        }

        Alert.alert('Success', 'Login successful');
        await AsyncStorage.setItem('IS_LOGGED_IN', 'true');
        await AsyncStorage.setItem('USER_ROLE', response.role || 'student');
        navigation.replace('Dashboard');
      })
      .catch((error) => {
        Alert.alert('Error', typeof error === 'string' ? error : 'Login failed');
      })
      .finally(() => setIsLoading(false));
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${AUTH_URL}/verify-otps`, {
        email: email.trim().toLowerCase(),
        otp: otp
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('IS_LOGGED_IN', 'true');
        await AsyncStorage.setItem('USER_ROLE', response.data.role || 'student');
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        await AsyncStorage.setItem('authToken', response.data.token);
        dispatch(setUser(response.data));

        Alert.alert(
          'Success',
          'Email verified successfully',
          [{ text: 'OK', onPress: () => navigation.replace('Dashboard') }]
        );
      }
    } catch (error) {
      console.log('OTP Verification Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`${AUTH_URL}/send-otp`, { email: email.trim().toLowerCase() });
      Alert.alert('Success', 'OTP resent successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <LinearGradient
      colors={['#1a0033', '#3b014f', '#5a015a']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => showOtpInput ? setShowOtpInput(false) : navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{showOtpInput ? 'Verification' : 'College Student Login'}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {showOtpInput ? (
          <>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleVerifyOtp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
              <Text style={[styles.resendText, isLoading && { opacity: 0.5 }]}>Resend OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="College Email"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#ccc"
                secureTextEntry={secure}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Ionicons
                  name={secure ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#fff"
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Signup */}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={isLoading}>
              <Text style={styles.signupText}>Don’t have an account? Sign up</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </LinearGradient>
  );
};

export default CollegeStudentLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#fff',
  },
  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  loginBtn: {
    backgroundColor: '#12002b',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  signupText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 18,
    opacity: 0.8,
  },
  content: {
    marginTop: 140,
  },
  cameraIcon: {
    width: 24,
    height: 24,
  },
  resendText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.8,
    textDecorationLine: 'underline',
  },
});
