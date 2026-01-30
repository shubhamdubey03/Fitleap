import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const CollegeStudentLogin = ({ navigation }) => {
  const [secure, setSecure] = useState(true);

  return (
    <LinearGradient
      colors={['#1a0033', '#3b014f', '#5a015a']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>College Student Login</Text>
      </View>

      {/* College Email */}
      <View style={styles.content}>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="College Email"
            placeholderTextColor="#ccc"
            style={styles.input}
          />
        </View>

        {/* Password */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry={secure}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#fff"
              style={styles.cameraIcon}
              onPress={() => setSecure(!secure)}
            />
          </TouchableOpacity>
        </View>

        {/* College ID */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="College ID (Optional)"
            placeholderTextColor="#ccc"
            style={styles.input}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Signup */}
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Don’t have an account? Sign up</Text>
        </TouchableOpacity>
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
});
