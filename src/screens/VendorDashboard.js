import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import ProfileSidebar from '../components/ProfileSidebar';

const VendorDashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <LinearGradient colors={['#1a0033', '#4b0066']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Menu Button */}
        <TouchableOpacity
          style={{ marginTop: 50, marginLeft: 20 }}
          onPress={() => setSidebarVisible(true)}
        >
          <Ionicons name="menu-outline" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Sidebar */}
        <ProfileSidebar
          visible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => setSidebarVisible(true)}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.hello}>Hello Vendor</Text>
              <Text style={styles.title}>Manage Your Store</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <Ionicons name="chatbubble-outline" size={22} color="#fff" />
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </View>
        </View>

        {/* Sales Card */}
        <View style={styles.card}>
          <View style={styles.progressCircle}>
            <Text style={styles.percent}>₹4.5K</Text>
            <Text style={styles.label}>Today Sales</Text>
          </View>

          <View>
            <Text style={styles.stat}>Orders: 12</Text>
            <Text style={styles.stat}>Revenue: ₹4,500</Text>
            <Text style={styles.stat}>Pending: 3</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Text style={styles.cardTitle}>Products</Text>
            <Text style={styles.steps}>28</Text>
            <Text style={styles.sub}>Listed</Text>
          </View>

          <View style={styles.smallCard}>
            <Text style={styles.cardTitle}>Rating</Text>
            <Text style={styles.kcal}>4.8★</Text>
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.ordersCard}>
          <Text style={styles.cardTitle}>Recent Orders</Text>
          <Text style={styles.orders}>Order #1234 - ₹1200</Text>
          <Text style={styles.orders}>Order #1233 - ₹800</Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.section}>Quick Actions</Text>
        <View style={styles.row}>
          {['Add Product', 'View Orders', 'Analytics', 'Settings'].map(
            item => (
              <TouchableOpacity key={item} style={styles.action}>
                <Text style={styles.actionText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 45, height: 45, borderRadius: 22, marginRight: 10 },
  hello: { color: '#ccc', fontSize: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row', gap: 12 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: '#ff6b00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percent: { fontSize: 20, fontWeight: 'bold', color: '#ff6b00' },
  label: { fontSize: 12 },

  stat: { fontSize: 14, marginBottom: 6 },

  row: { flexDirection: 'row', justifyContent: 'space-between' },

  smallCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: { fontWeight: 'bold', marginBottom: 8 },
  steps: { fontSize: 22, color: '#ff6b00' },
  kcal: { fontSize: 18, color: '#ff6b00' },
  sub: { color: '#777' },

  ordersCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  orders: { color: '#ff6b00', fontWeight: '500', marginTop: 8 },

  section: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },

  action: {
    backgroundColor: '#3b145f',
    padding: 12,
    borderRadius: 12,
    width: '23%',
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontSize: 11, textAlign: 'center' },
});

export default VendorDashboard;
