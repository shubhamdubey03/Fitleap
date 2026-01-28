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
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ProfileSidebar = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible,slideAnim]);

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity style={styles.overlay} onPress={closeSidebar} />

      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: slideAnim }] },
        ]}
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
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </View>

          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatar} />
            <Text style={styles.name}>Sophia</Text>
            <Text style={styles.phone}>+1-555-123-4567</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.item}>
            <Text style={styles.itemText}>Age : 28</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>Gender : Female</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>Weight : 65Kg</Text>
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};
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
    marginTop: 40,
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
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: '#14004d',
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});


export default ProfileSidebar;
