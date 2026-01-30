import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ProfileSidebar = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

//  const handleLogout = async () => {
//   try {
//     // ❌ user delete mat karo
//     // await AsyncStorage.removeItem('DUMMY_USER');

//     // ✅ sirf logout state change karo
//     await AsyncStorage.setItem('IS_LOGGED_IN', 'false');
//   } catch (e) {
//     console.log('Logout error:', e);
//   }

//   // sidebar close animation
//   closeSidebar();

//   // navigation reset (after animation)
//   setTimeout(() => {
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   }, 320);
// };

const handleLogout = async () => {
  try {
     await AsyncStorage.setItem('IS_LOGGED_IN', 'false');


    // sidebar close
    closeSidebar();

    // navigation reset (Login screen)
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 300);
  } catch (e) {
    console.log('Logout error:', e);
  }
};


  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity style={styles.overlay} onPress={closeSidebar} />

      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        <LinearGradient
          colors={['#0f0029', '#2b0040', '#5a003c']}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={closeSidebar}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="settings-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatar} />
            <Text style={styles.name}>Sophia</Text>
            <Text style={styles.phone}>+1-555-123-4567</Text>
          </View>

          {/* Menu Items */}
          <ProfileItem icon="time-outline" label="Age" value="28" />
          <ProfileItem icon="female-outline" label="Gender" value="Female" />
          <ProfileItem icon="resize-outline" label="Height" value="5'6" />
          <ProfileItem icon="barbell-outline" label="Weight" value="65 Kg" />

          {/* Calculated Metrics */}
          <Text style={styles.sectionTitle}>Calculated Metrics</Text>

          <ProfileItem icon="calculator-outline" label="BMI" value="22.5" />
          <ProfileItem icon="flame-outline" label="BMR" value="1400 Kcal" />
          <ProfileItem icon="pulse-outline" label="TGEE" value="1800 Kcal" />

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};
const ProfileItem = ({ icon, label, value }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemLeft}>
      <Ionicons name={icon} size={18} color="#fff" />
      <Text style={styles.itemText}>
        {label} : {value}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#aaa" />
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    position: 'absolute',
    width: '80%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -18,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
  },
  name: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  phone: {
    color: '#ccc',
    fontSize: 13,
  },
  item: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  logoutBtn: {
    backgroundColor: '#2b0040',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 15,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    
  },
});

export default ProfileSidebar;
