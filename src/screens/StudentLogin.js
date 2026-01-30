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
import Ionicons from '@react-native-vector-icons/ionicons';

const StudentLoginScreen = ({ navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');

  return (
    <LinearGradient
      colors={['#0f0029', '#2b0040', '#5a003c']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Login</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Student ID</Text>
        <Text style={styles.subtitle}>
          Enter your student ID and guardian's email for verification.
        </Text>

        <TextInput
          placeholder="Student ID"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={studentId}
          onChangeText={setStudentId}
        />

        <TextInput
          placeholder="Guardian Email"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    marginTop: 200,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#14004d',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default StudentLoginScreen;
