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
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryPicker from 'react-native-country-picker-modal';
import Svg, { Circle } from 'react-native-svg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


// export const COUNTRIES = [
//   { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
//   { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
//   { code: 'UK', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
//   { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
//   { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
// ];

const roles = [
  { key: 'user', label: 'User' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'coach', label: 'Coach' },
];

const SignupScreen = ({ navigation }) => {
  const [secure, setSecure] = useState(true);
  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [country, setCountry] = useState(null);
  const [countryVisible, setCountryVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [roleVisible, setRoleVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);


  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
          console.log('ImagePicker Error:', response.errorMessage);
          return;
        }

        const imageUri = response.assets[0].uri;
        setAvatar(imageUri);
      }
    );
  };
  const handleSignup = async () => {
    if (!email) {
      alert('Email is required');
      return;
    }

    if (!password) {
      alert('Password is required');
      return;
    }

    if (!phone) {
      alert('Phone number is required');
      return;
    }

    // if (!country) {
    //   alert('Please select a country');
    //   return;
    // }

    // if (!callingCode) {
    //   alert('Country calling code is missing');
    //   return;
    // }

    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    const dummyUser = {
      email,
      password,
      phone,
      role: selectedRole.label,
      countryCode,
      callingCode,
    };

    const existingUser = await AsyncStorage.getItem('DUMMY_USER');

    if (existingUser) {
      const storedUser = JSON.parse(existingUser);

      if (storedUser.email === email) {
        alert('Email already registered');
        return;
      }
    }


    try {
      await AsyncStorage.setItem('DUMMY_USER', JSON.stringify(dummyUser));

      await AsyncStorage.setItem('IS_LOGGED_IN', 'false');
      alert('Signup successful. Please Login.');
      navigation.navigate('Login');
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    }
  };

  return (

    <LinearGradient
      colors={['#1a0033', '#3b014f', '#5a015a']}
      style={styles.container}
    >
      {/* Title */}
      <Text style={styles.title}>Create{'\n'}Account</Text>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {/* {avatar ? (
    <Image source={{ uri: avatar }} style={styles.avatarImage} />
  ) : (
    <Ionicons name="person" size={40} color="#aaa" />
  )} */}

        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
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
          value={email}
          onChangeText={text => setEmail(text)}
          autoCapitalize="none"
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
          value={password}
          onChangeText={text => setPassword(text)}
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
      <View style={styles.phoneContainer}>
        {/* Left section: Country picker with flag + code */}
        <CountryPicker
          countryCode={countryCode}
          withFlag
          withEmoji
          withCallingCode
          visible={countryVisible}
          onSelect={selectedCountry => {
            setCountryCode(selectedCountry.cca2);
            setCallingCode(selectedCountry.callingCode?.[0] ?? '');
            setCountry(selectedCountry);
            setCountryVisible(false);
          }}
          onClose={() => setCountryVisible(false)}
        />

        <TouchableOpacity
          style={styles.leftIcons}
          onPress={() => setCountryVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.callingCode}>+{callingCode}</Text>

          <Ionicons
            name="chevron-down"
            size={14}
            color="#ccc"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>

        {/* Phone input */}
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
          style={styles.phoneInput}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

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
      <TouchableOpacity style={styles.nextBtn} onPress={handleSignup}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity onPress={() => navigation.replace('Home')}>
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
    marginBottom: 10,
    opacity: 0.8,
  },
  loginBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
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
  user: {
    marginBottom: 10,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 15,
  },

  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  callingCode: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  phoneInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
});

export default SignupScreen;
