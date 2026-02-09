import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';

const LoginScreen = ({ route, navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(route.params?.email || '');
  const [password, setPassword] = useState(route.params?.password || '');
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);



  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    const userData = {
      email,
      password,
    };

    dispatch(login(userData))
      .unwrap()
      .then(async (user) => {
        await handleLoginSuccess(user);
      })
      .catch((error) => {
        alert(error);
      });
  };



  const handleLoginSuccess = async (user) => {
    alert('Login successful');
    // Persist Login State Locally
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
  };

  return (
    <LinearGradient
      colors={['#0f0029', '#2b0040', '#5a003c']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Inputs */}
      <View style={styles.inputContainer}>
        {/* Email / Phone */}
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            style={styles.input}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>


        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Login</Text>}
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.replace('Home')}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>


      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginTop: 220,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#14004d',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default LoginScreen;
