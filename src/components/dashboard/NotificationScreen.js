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
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { addNotification, reset } from '../../redux/notificationSlice';

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const [loading, setLoading] = React.useState(false);
  const [dbNotifications, setDbNotifications] = React.useState([]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.data.success) {
        setDbNotifications(res.data.data);
      }
    } catch (e) {
      console.error("Fetch notifications error:", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    const markAll = async () => {
      try {
        await axios.put(
          `${API_BASE_URL}/notifications/read-all`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } catch (e) {
        console.error(e);
      }
    };

    markAll();
    dispatch(reset()); // Reset unread count when viewing history
  }, []);

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

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {dbNotifications.length > 0 ? (
          dbNotifications.map((item, index) => (
            <View key={index} style={[styles.notificationCard, { borderColor: '#FFD700', borderWidth: 1 }]}>
              <View style={styles.iconBox}>
                <Ionicons name="notifications-outline" size={20} color="#fff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.body}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 5 }}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={{ marginTop: 50, alignItems: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
              {loading ? 'Loading notifications...' : 'No notifications found'}
            </Text>
          </View>
        )}
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
