import React, { useState } from 'react';
import {
  Image,
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDispatch } from 'react-redux';
import { register } from '../redux/authSlice';
import CountryPicker from 'react-native-country-picker-modal';
import { launchImageLibrary } from 'react-native-image-picker';
// import DocumentPicker from 'react-native-document-picker'; // Removed unused import

const SignupScreen = ({ navigation }) => {
  const [secure, setSecure] = useState(true);
  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [countryVisible, setCountryVisible] = useState(false);

  // Role Selection
  const [role, setRole] = useState('user'); // 'user' or 'coach'

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

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
    if (!name || !email || !password || !phone) {
      alert('Please fill all common fields (Name, Email, Password, Phone)');
      return;
    }

    let userData;
    if (role === 'user') {
      userData = {
        name,
        email,
        password,
        mobile: String(phone),
        countryCode,
      };
    } else {
      // Coach Role - FormData
      if (!bankName || !bankAccountNo || !ifscCode) {
        alert('Please fill all coach details');
        return;
      }

      if (!certificate || !aadharDoc || !panDoc) {
        alert('Please upload all required documents (Certificate, Aadhar, PAN)');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('mobile', String(phone)); // Changed to mobile to match backend
      formData.append('countryCode', countryCode);

      formData.append('bankName', bankName);
      formData.append('bankAccNo', bankAccountNo); // Match backend field
      formData.append('ifscCode', ifscCode);

      // Files - using specific names backend expects
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

    dispatch(register({ userData, role }))
      .unwrap()
      .then((response) => {
        const message = response.message || 'Signup successful. Please Login.';
        alert(message);
        navigation.replace('Login');
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <LinearGradient
      colors={['#1a0033', '#3b014f', '#5a015a']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Create{'\n'}Account</Text>

        {/* Role Toggle */}
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
            style={[styles.roleOption, role === 'coach' && styles.roleActive]}
            onPress={() => setRole('coach')}>
            <View style={styles.radioCircle}>
              {role === 'coach' && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.roleText}>Coach</Text>
          </TouchableOpacity>
        </View>

        {/* Common Fields */}
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
        </View>

        {/* Coach Specific Fields */}
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

        {/* Action Buttons */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleSignup}>
          <Text style={styles.nextText}>{role === 'coach' ? 'Submit Application' : 'Next'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace('Home')}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => {
          fetch('http://192.168.1.43:5000/')
            .then(() => alert('Connected Successfully!'))
            .catch(err => alert('Connection Error: ' + err.message));
        }} style={{ marginTop: 20 }}>
          <Text style={{ color: 'yellow', textAlign: 'center' }}>Test Connection (192.168.1.43)</Text>
        </TouchableOpacity> */}
      </ScrollView>
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
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  callingCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  callingCode: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  phoneInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
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
    fontSize: 18,
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
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 20,
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
    marginBottom: 50,
    opacity: 0.8,
  },
});

export default SignupScreen;
