import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

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
            placeholder="Email / Phone no."
            placeholderTextColor="#ccc"
            style={styles.input}
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

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
  cancelText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 14,
  },
});

export default LoginScreen;
