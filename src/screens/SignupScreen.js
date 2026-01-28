import React, { useState } from 'react';
import {
  Image,
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const countries = [
  { code: 'IN', name: 'India', flag: require('../assets/images/indian.png') },
];

const roles = [
  { key: 'user', label: 'User' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'coach', label: 'Coach' },
];

const SignupScreen = ({ navigation }) => {
  const [secure, setSecure] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [countryVisible, setCountryVisible] = useState(false);

  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [roleVisible, setRoleVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#1a0033', '#3b014f', '#5a015a']}
      style={styles.container}
    >
      {/* Title */}
      <Text style={styles.title}>Create{'\n'}Account</Text>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Ionicons
          name="camera-outline"
          size={24}
          color="#fff"
          style={styles.cameraIcon}
        />
      </View>

      {/* Email */}
      <View style={styles.inputBox}>
        <Ionicons
          name="mail-outline"
          size={22}
          color="#fff"
          style={styles.cameraIcon}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          style={styles.input}
        />
      </View>

      {/* Password */}
      <View style={styles.inputBox}>
        <Ionicons
          name="lock-closed-outline"
          size={22}
          color="#fff"
          style={styles.cameraIcon}
        />
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

      {/* Phone Number */}
      <View style={styles.inputBox}>
        <TouchableOpacity
          style={styles.countryBox}
          onPress={() => setCountryVisible(true)}
        >
          <Image source={selectedCountry.flag} style={styles.flag} />
          <Image
            source={require('../assets/images/down.png')}
            style={styles.downIcon}
          />
        </TouchableOpacity>

        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      {/* Country Modal */}
      <Modal transparent visible={countryVisible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setCountryVisible(false)}
        >
          <View style={styles.dropdown}>
            {countries.map(item => (
              <TouchableOpacity
                key={item.code}
                style={styles.countryRow}
                onPress={() => {
                  setSelectedCountry(item);
                  setCountryVisible(false);
                }}
              >
                <Image source={item.flag} style={styles.flag} />
                <Text style={styles.countryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Role Selection */}
      <View style={styles.inputBox}>
        <TouchableOpacity
          style={styles.roleTouchable}
          onPress={() => setRoleVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.roleText}>{selectedRole.label}</Text>
        </TouchableOpacity>

        <Image
          source={require('../assets/images/down.png')}
          style={styles.downIcon}
        />
      </View>

      {/* Role Modal */}
      <Modal transparent visible={roleVisible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setRoleVisible(false)}
        >
          <View style={styles.dropdown}>
            {roles.map(item => (
              <TouchableOpacity
                key={item.key}
                style={styles.countryRow}
                onPress={() => {
                  setSelectedRole(item);
                  setRoleVisible(false);
                }}
              >
                <Text style={styles.countryText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '600',
    marginTop: 80,
    marginBottom: 30,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
  },
  roleText: {
    color: '#fff',
    marginLeft: 5,
  },
  nextBtn: {
    backgroundColor: '#12002b',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  nextText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  cancel: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 18,
    opacity: 0.8,
  },
  cameraIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  countryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  flag: {
    width: 24,
    height: 16,
    resizeMode: 'contain',
  },
  downIcon: {
    width: 10,
    height: 10,
    marginLeft: 6,
    resizeMode: 'contain',
    tintColor: '#ccc',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#fff',
    width: 200,
    borderRadius: 10,
    padding: 10,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  countryText: {
    marginLeft: 10,
    fontSize: 14,
  },
  roleTouchable: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default SignupScreen;
