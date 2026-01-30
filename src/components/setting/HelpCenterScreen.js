import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const topics = [
  {
    icon: 'leaf-outline',
    title: 'Nutrition',
    desc: 'Learn how to track your meals and calories',
  },
  {
    icon: 'barbell-outline',
    title: 'Workouts',
    desc: 'Get started with your workout routines',
  },
  {
    icon: 'checkmark-circle-outline',
    title: 'Habits',
    desc: 'Build and maintain healthy habits',
  },
  {
    icon: 'person-outline',
    title: 'Coaching',
    desc: 'Connect with your coach and get personalized guidance',
  },
  {
    icon: 'list-outline',
    title: 'Programs',
    desc: 'Explore and join fitness programs',
  },
  {
    icon: 'card-outline',
    title: 'Payments',
    desc: 'Manage your subscription and payment details',
  },
];

const HelpCenterScreen = ({ navigation }) => {
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

        <Text style={styles.headerTitle}>Help Center</Text>

        <View style={styles.coinCircle}>
          <Ionicons name="logo-bitcoin" size={18} color="#FFD700" />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#fff" />
        <TextInput
          placeholder="Search FAQs"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <Text style={styles.sectionTitle}>Popular topics</Text>

        {topics.map((item, index) => (
          <TouchableOpacity key={index} style={styles.topicCard}>
            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={20} color="#fff" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.topicTitle}>{item.title}</Text>
              <Text style={styles.topicDesc}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default HelpCenterScreen;

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
    justifyContent: 'center',
    alignItems: 'center',
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

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },

  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  topicDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
});
