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
  ActivityIndicator,
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
  const [loading, setLoading] = useState(false);

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

  // Field Verification States
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [verifyingEmail, setVerifyingEmail] = useState(false);

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

    // Phone validation: exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      alert('Mobile number must be exactly 10 digits.');
      return;
    }

    if (role === 'user' && !isEmailVerified) {
      alert('Please verify your email address before signing up.');
      return;
    }

    // Name validation: Only alphabets and spaces allowed
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      alert('Name must only contain alphabets (no numbers or special characters allowed).');
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert('Please provide a valid email address.');
      return;
    }

    if (!trimmedEmail.endsWith('@gmail.com') && !trimmedEmail.endsWith('.edu')) {
      alert('Only @gmail.com and .edu email addresses are allowed.');
      return;
    }

    // Password Validation: Strong Password
    // Requires: At least 8 chars, at least one letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(trimmedPassword)) {
      alert('Password must be at least 8 characters long and include alphabets, numbers, and special characters.');
      return;
    }

    setLoading(true);

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
        email_verified: isEmailVerified,
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
      formData.append('email_verified', isEmailVerified);

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
      const trimmedReBankAccNo = reEnterBankAccountNo.trim();
      const trimmedIfsc = ifscCode.trim();

      if (!trimmedBankName || !trimmedBankAccNo || !trimmedReBankAccNo || !trimmedIfsc) {
        alert('Please fill all coach details');
        return;
      }

      // Bank Name validation: alphabets and spaces only
      const bankNameRegex = /^[A-Za-z\s]+$/;
      if (!bankNameRegex.test(trimmedBankName)) {
        alert('Bank Name must only contain alphabets (no numbers or special characters allowed).');
        return;
      }
      if (trimmedBankAccNo !== trimmedReBankAccNo) {
        alert('Bank Account Number and Re-enter Account Number must match.');
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
      formData.append('email_verified', isEmailVerified);

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
      setLoading(false);
      navigation.replace('Dashboard');
      return;
    }

    if (response.requireOtp) {
      setTempUserEmail(response.email);
      setShowOtpInput(true);
      setLoading(false);
      alert(response.message || 'OTP sent to your email.');
      return;
    }

    // If no token, it means account is pending approval
    setLoading(false);
    alert(response.message || 'Signup successful. Your student account is pending admin approval.');
    navigation.replace('Home');
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${AUTH_URL}/verify-otp`, {
        email: tempUserEmail,
        otp: otp
      });

      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
        dispatch(setUser(response.data));
        setLoading(false);
        alert('Email verified successfully!');
        navigation.replace('Dashboard');
      }
    } catch (error) {
      setLoading(false);
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
    setLoading(false);
    console.log('Signup Error:', error);
    const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred';
    alert(errorMessage);
  };

  const handleSendEmailFieldOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert('Please enter a valid email address first.');
      return;
    }

    if (!trimmedEmail.endsWith('@gmail.com') && !trimmedEmail.endsWith('.edu')) {
      alert('Only @gmail.com and .edu email addresses are allowed.');
      return;
    }

    setVerifyingEmail(true);
    try {
      await axios.post(`${AUTH_URL}/send-otp`, { email: trimmedEmail });
      setEmailOtpSent(true);

      console.log("otp", trimmedEmail)
      alert('OTP sent to your email.');
    } catch (error) {
      console.log('Send OTP Error:', error);
      alert(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleVerifyEmailFieldOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    setVerifyingEmail(true);
    try {
      const response = await axios.post(`${AUTH_URL}/verify-otps`, {
        email: email.trim().toLowerCase(),
        otp: emailOtp
      });
      if (response.status === 200) {
        setIsEmailVerified(true);
        setEmailOtpSent(false);
        alert('Email verified successfully!');
      }
    } catch (error) {
      console.log('OTP Verification Error:', error);
      alert(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setVerifyingEmail(false);
    }
  };
  console.log("+++++++", emailOtpSent)

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
              <TouchableOpacity style={styles.nextBtn} onPress={handleVerifyOtp} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.nextText}>Verify OTP</Text>
                )}
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
                    onChangeText={(val) => {
                      setEmail(val);
                      if (isEmailVerified) setIsEmailVerified(false);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!(role === 'user' && isEmailVerified)}
                  />
                  {!isEmailVerified && email.length > 5 && role === 'user' && (
                    <TouchableOpacity
                      style={styles.verifyBtn}
                      onPress={handleSendEmailFieldOtp}
                      disabled={verifyingEmail}
                    >
                      {verifyingEmail ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.verifyBtnText}>{emailOtpSent ? 'Resend' : 'Verify'}</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  {isEmailVerified && role === 'user' && (
                    <Ionicons name="checkmark-circle" size={24} color="#4ade80" style={{ marginLeft: 10 }} />
                  )}
                </View>

                {emailOtpSent && !isEmailVerified && role === 'user' && (
                  <View style={styles.inputBox}>
                    <Ionicons name="key-outline" size={22} color="#fff" style={styles.icon} />
                    <TextInput
                      placeholder="Enter OTP"
                      placeholderTextColor="#ccc"
                      style={styles.input}
                      value={emailOtp}
                      onChangeText={setEmailOtp}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                    <TouchableOpacity
                      style={styles.confirmBtn}
                      onPress={handleVerifyEmailFieldOtp}
                      disabled={verifyingEmail}
                    >
                      {verifyingEmail ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.verifyBtnText}>Confirm</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

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

              <TouchableOpacity style={styles.nextBtn} onPress={handleSignup} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.nextText}>{role === 'coach' ? 'Submit Application' : 'Next'}</Text>
                )}
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
  verifyBtn: {
    backgroundColor: '#a34eff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  confirmBtn: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SignupScreen;
