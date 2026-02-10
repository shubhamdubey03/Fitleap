import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const notifications = [
  {
    icon: 'flame-outline',
    title: 'Habit Streak',
    desc: "You've maintained your habit streak for 7 days!",
  },
  {
    icon: 'barbell-outline',
    title: 'Workout Reminder',
    desc: 'Time for your daily workout session.',
  },
  {
    icon: 'chatbubble-ellipses-outline',
    title: 'Coaching Update',
    desc: 'Coach Alex has sent you a new message.',
  },
  {
    icon: 'list-outline',
    title: 'Program Update',
    desc: 'Your program "Healthy Eating" has been updated.',
  },
  {
    icon: 'card-outline',
    title: 'Payment Reminder',
    desc: 'Your payment for the coaching program is due.',
  },
];



const NotificationScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#1a0033', '#3b0a57', '#6a0f6b']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notification</Text>

        <View style={styles.coinCircle}>
          <Ionicons name="logo-bitcoin" size={18} color="#FFD700" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {notifications.map((item, index) => (
          <View key={index} style={styles.notificationCard}>
            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={20} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  coinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  desc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
});
