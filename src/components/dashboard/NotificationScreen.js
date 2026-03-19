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

  const [habits, setHabits] = React.useState([]);

  const fetchHabits = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/habits`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log("habitsaaaaaaaaaaaaaaaaaaaaaa", res.data)
      if (res.data.success) {
        setHabits(res.data.data);
      }
    } catch (e) {
      console.error("Fetch habits error:", e);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.data.success) {
        setDbNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );
      }
    } catch (e) {
      console.error("Mark as read error:", e);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    fetchHabits();
    dispatch(reset()); // Reset unread count when viewing history
  }, []);

  return (
    <LinearGradient
      colors={['#1a0033', '#3b014f', '#5a015a']}
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
            <View key={index} style={[styles.notificationCard, { borderColor: item.is_read ? 'rgba(255,255,255,0.1)' : '#FFD700', borderWidth: 1 }]}>
              <View style={styles.iconBox}>
                <Ionicons name={item.is_read ? "notifications-outline" : "notifications"} size={20} color={item.is_read ? "#aaa" : "#fff"} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[styles.title, { color: item.is_read ? 'rgba(255,255,255,0.6)' : '#fff' }]}>{item.title}</Text>
                  {!item.is_read && <View style={styles.unreadDot} />}
                </View>
                <Text numberOfLines={3} style={[styles.desc, { color: item.is_read ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)' }]}>{item.body}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
                    {new Date(item.created_at).toLocaleString()}
                  </Text>

                  {!item.is_read && (
                    <TouchableOpacity
                      style={styles.markReadBtn}
                      onPress={() => handleMarkAsRead(item.id)}
                    >
                      <Text style={styles.markReadText}>Mark as read</Text>
                    </TouchableOpacity>
                  )}
                </View>
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
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  markReadBtn: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#FFD700',
  },
  markReadText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
  },
});
