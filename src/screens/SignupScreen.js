import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDispatch } from 'react-redux';
import { register, registerCoach, setUser } from '../redux/authSlice';
import axios from 'axios';
import { AUTH_URL } from '../config/api';
import CountryPicker from 'react-native-country-picker-modal';
import { launchImageLibrary } from 'react-native-image-picker';

const SignupScreen = ({ navigation }) => {
  const [secure, setSecure] = useState(true);
  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [countryVisible, setCountryVisible] = useState(false);

  // Role Selection
  const [role, setRole] = useState('user'); // 'user', 'student', or 'coach'

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [referralByCode, setReferralByCode] = useState('');

  // OTP Verification
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempUserEmail, setTempUserEmail] = useState('');

  // Coach Specific Fields
  const [bankName, setBankName] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [reEnterBankAccountNo, setReEnterBankAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const [certificate, setCertificate] = useState(null);
  const [aadharDoc, setAadharDoc] = useState(null);
  const [panDoc, setPanDoc] = useState(null);

  const dispatch = useDispatch();

  const pickDocument = (setter) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log('ImagePicker Error:', response.errorMessage);
          return;
        }

        const asset = response.assets[0];
        setter({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || 'document.jpg',
        });
      }
    );
  };

  const handleSignup = async () => {
    // Trim values
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedPhone = phone.trim();

    // Basic required check
    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedPhone) {
      alert('Please fill all common fields (Name, Email, Password, Phone)');
      return;
    }

    let userData;
    if (role === 'user') {
      userData = {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        mobile: String(trimmedPhone),
        countryCode,
        referralByCode: referralByCode.trim(),
        role: 'User',
      };
    } else if (role === 'student') {
      const formData = new FormData();
      formData.append('name', trimmedName);
      formData.append('email', trimmedEmail);
      formData.append('password', trimmedPassword);
      formData.append('mobile', String(trimmedPhone));
      formData.append('countryCode', countryCode);
      formData.append('referralByCode', referralByCode.trim());
      formData.append('role', 'Student');

      if (certificate) {
        formData.append('idCard', {
          uri: certificate.uri,
          type: certificate.type,
          name: certificate.name,
        });
      }
      userData = formData;
    } else {
      // Coach Role - FormData
      const trimmedBankName = bankName.trim();
      const trimmedBankAccNo = bankAccountNo.trim();
      const trimmedIfsc = ifscCode.trim();

      if (!trimmedBankName || !trimmedBankAccNo || !trimmedIfsc) {
        alert('Please fill all coach details');
        return;
      }

      const formData = new FormData();
      formData.append('name', trimmedName);
      formData.append('email', trimmedEmail);
      formData.append('password', trimmedPassword);
      formData.append('mobile', String(trimmedPhone));
      formData.append('countryCode', countryCode);
      formData.append('bankName', trimmedBankName);
      formData.append('bankAccNo', trimmedBankAccNo);
      formData.append('ifscCode', trimmedIfsc);

      if (!certificate || !aadharDoc || !panDoc) {
        alert('Please upload all required documents (Certificate, Aadhar, PAN)');
        return;
      }

      formData.append('nutrition', {
        uri: certificate.uri,
        type: certificate.type,
        name: certificate.name,
      });
      formData.append('aadharCard', {
        uri: aadharDoc.uri,
        type: aadharDoc.type,
        name: aadharDoc.name,
      });
      formData.append('panCard', {
        uri: panDoc.uri,
        type: panDoc.type,
        name: panDoc.name,
      });

      userData = formData;
    }

    if (role === 'user' || role === 'student') {
      dispatch(register(userData))
        .unwrap()
        .then(handleSuccess)
        .catch(handleError);
    } else {
      dispatch(registerCoach(userData))
        .unwrap()
        .then(handleSuccess)
        .catch(handleError);
    }
  };

  const handleSuccess = async (response) => {
    if (response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      dispatch(setUser(response));
      navigation.replace('Dashboard');
      return;
    }

    if (response.requireOtp) {
      setTempUserEmail(response.email);
      setShowOtpInput(true);
      alert(response.message || 'OTP sent to your email.');
      return;
    }

    // If no token, it means account is pending approval
    alert(response.message || 'Signup successful. Your student account is pending admin approval.');
    navigation.replace('Home');
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await axios.post(`${AUTH_URL}/verify-otp`, {
        email: tempUserEmail,
        otp: otp
      });

      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        dispatch(setUser(response.data));
        alert('Email verified successfully!');
        navigation.replace('Dashboard');
      }
    } catch (error) {
      console.log('OTP Verification Error:', error);
      alert(error.response?.data?.message || 'Verification failed');
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`${AUTH_URL}/send-otp`, { email: tempUserEmail });
      alert('OTP resent successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const handleError = (error) => {
    console.log('Signup Error:', error);
    const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred';
    alert(errorMessage);
  };

  return (
    <LinearGradient
      colors={['#1a0033', '#3b014f', '#5a015a']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{showOtpInput ? 'Verify\nEmail' : 'Create\nAccount'}</Text>

        {showOtpInput ? (
          <View style={styles.formSection}>
            <Text style={styles.otpInfoText}>
              Please enter the 6-digit code sent to {tempUserEmail}
            </Text>
            <View style={styles.inputBox}>
              <Ionicons name="key-outline" size={22} color="#fff" style={styles.icon} />
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={handleVerifyOtp}>
              <Text style={styles.nextText}>Verify OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowOtpInput(false)}>
              <Text style={styles.cancel}>Back to Signup</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>

            <View style={styles.roleToggleContainer}>
              <TouchableOpacity
                style={[styles.roleOption, role === 'user' && styles.roleActive]}
                onPress={() => setRole('user')}>
                <View style={styles.radioCircle}>
                  {role === 'user' && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.roleText}>User</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleOption, role === 'student' && styles.roleActive]}
                onPress={() => setRole('student')}>
                <View style={styles.radioCircle}>
                  {role === 'student' && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.roleText}>Student</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleOption, role === 'coach' && styles.roleActive]}
                onPress={() => setRole('coach')}>
                <View style={styles.radioCircle}>
                  {role === 'coach' && <View style={styles.selectedRb} />}
                </View>
                <Text style={styles.roleText}>Coach</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputBox}>
                <Ionicons name="person-outline" size={22} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#ccc"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={22} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#ccc"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={22} color="#fff" style={styles.icon} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#ccc"
                  secureTextEntry={secure}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)}>
                  <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.phoneContainer}>
                <CountryPicker
                  countryCode={countryCode}
                  withFlag
                  withEmoji
                  withCallingCode
                  visible={countryVisible}
                  onSelect={selectedCountry => {
                    setCountryCode(selectedCountry.cca2);
                    setCallingCode(selectedCountry.callingCode?.[0] ?? '');
                    setCountryVisible(false);
                  }}
                  onClose={() => setCountryVisible(false)}
                />
                <TouchableOpacity onPress={() => setCountryVisible(true)} style={styles.callingCodeBtn}>
                  <Text style={styles.callingCode}>+{callingCode}</Text>
                  <Ionicons name="chevron-down" size={14} color="#ccc" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
                <TextInput
                  placeholder="Mobile Number"
                  placeholderTextColor="#ccc"
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {role === 'user' && (
                <View style={styles.inputBox}>
                  <Ionicons name="gift-outline" size={22} color="#fff" style={styles.icon} />
                  <TextInput
                    placeholder="Referral Code (Optional)"
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    value={referralByCode}
                    onChangeText={setReferralByCode}
                    autoCapitalize="characters"
                  />
                </View>
              )}

              {role === 'student' && (
                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument(setCertificate)}>
                    <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                    <Text style={styles.uploadText}>{certificate ? 'ID Card Selected' : 'Upload Student ID Card'}</Text>
                  </TouchableOpacity>
                  {certificate && <Text style={styles.fileName}>{certificate.name}</Text>}
                </View>
              )}
            </View>

            {role === 'coach' && (
              <View style={styles.coachSection}>
                <Text style={styles.sectionHeader}>Coach Details</Text>

                <View style={styles.inputBox}>
                  <TextInput placeholder="Bank Name" placeholderTextColor="#ccc" style={styles.input} value={bankName} onChangeText={setBankName} />
                </View>

                <View style={styles.inputBox}>
                  <TextInput placeholder="Bank Account No" placeholderTextColor="#ccc" style={styles.input} value={bankAccountNo} onChangeText={setBankAccountNo} keyboardType="numeric" />
                </View>

                <View style={styles.inputBox}>
                  <TextInput placeholder="Re-enter Bank Account No" placeholderTextColor="#ccc" style={styles.input} value={reEnterBankAccountNo} onChangeText={setReEnterBankAccountNo} keyboardType="numeric" />
                </View>

                <View style={styles.inputBox}>
                  <TextInput placeholder="IFSC Code" placeholderTextColor="#ccc" style={styles.input} value={ifscCode} onChangeText={setIfscCode} autoCapitalize="characters" />
                </View>

                <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument(setCertificate)}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                  <Text style={styles.uploadText}>{certificate ? 'Certificate Selected' : 'Upload Nutrition Certificate'}</Text>
                </TouchableOpacity>
                {certificate && <Text style={styles.fileName}>{certificate.name}</Text>}

                <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument(setAadharDoc)}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                  <Text style={styles.uploadText}>{aadharDoc ? 'Aadhar Card Selected' : 'Upload Aadhar Card'}</Text>
                </TouchableOpacity>
                {aadharDoc && <Text style={styles.fileName}>{aadharDoc.name}</Text>}

                <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument(setPanDoc)}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                  <Text style={styles.uploadText}>{panDoc ? 'PAN Card Selected' : 'Upload PAN Card'}</Text>
                </TouchableOpacity>
                {panDoc && <Text style={styles.fileName}>{panDoc.name}</Text>}
              </View>
            )}

            <TouchableOpacity style={styles.nextBtn} onPress={handleSignup}>
              <Text style={styles.nextText}>{role === 'coach' ? 'Submit Application' : 'Next'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.replace('Home')}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 100,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '600',
    marginTop: 40,
    marginBottom: 30,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
  },
  roleActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#a34eff',
    borderWidth: 1,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  roleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    paddingVertical: 10,
    fontSize: 15,
  },
  icon: {
    marginRight: 5,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginBottom: 15,
  },
  callingCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  callingCode: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  phoneInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    fontSize: 15,
  },
  coachSection: {
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderStyle: 'dashed',
    marginTop: 15,
  },
  uploadText: {
    color: '#fff',
    marginLeft: 10,
  },
  fileName: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#12002b',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  nextText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  cancel: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 50,
    opacity: 0.8,
  },
  otpInfoText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'left',
  },
  resendText: {
    color: '#a34eff',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
});

export default SignupScreen;
