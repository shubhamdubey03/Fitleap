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

const settingsData = [
  { icon: 'person-outline', title: 'Edit Profile', subtitle: 'Edit your profile information' },
  { icon: 'chatbubble-ellipses-outline', title: 'Feedback And Review', subtitle: 'Share your thoughts and experiences' },
  { icon: 'gift-outline', title: 'Event & Rewards', subtitle: 'View upcoming events and earned rewards' },
  { icon: 'trophy-outline', title: 'Programs & Challenges', subtitle: 'Join programs and compete in challenges' },
  { icon: 'settings-outline', title: 'Add Habits', subtitle: 'Build and track new healthy habits' },
  { icon: 'card-outline', title: 'Payments & Bills', subtitle: 'Manage your subscriptions and payment methods' },
  { icon: 'document-text-outline', title: 'Invoice', subtitle: 'View and download your payment history' },
  { icon: 'notifications-outline', title: 'Subscription', subtitle: 'Manage your premium plan' },
  { icon: 'help-circle-outline', title: 'Help Center', subtitle: 'Get help and support' },
  { icon: 'bug-outline', title: 'Report Issue', subtitle: 'Report a bug or issue' },
];

const SettingsScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#1a0033', '#3b0a57', '#6a0f6b']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => {
              if (item.title === 'Edit Profile') {
                navigation.navigate('EditProfileScreen');
              } else if (item.title === 'Feedback And Review') {
                navigation.navigate('FeedbackProgressScreen');
              } else if (item.title === 'Event & Rewards') {
                navigation.navigate('EventsRewardsScreen');
              }
              else if (item.title === 'Report Issue') {
                navigation.navigate('ReportIssueScreen');
              }
              else if (item.title === 'Payments & Bills') {
                navigation.navigate('PaymentsAndBillsScreen');
              }
              else if (item.title === 'Add Habits') {
                navigation.navigate('AddHabitScreen');
              }
              else if (item.title === 'Help Center') {
                navigation.navigate('HelpCenterScreen');
              }
              else if (item.title === 'Invoice') {
                navigation.navigate('InvoiceHistoryScreen');
              }
              else if (item.title === 'Programs & Challenges') {
                navigation.navigate('ProgramsAndChallenges');
              }
              else if (item.title === 'Subscription') {
                navigation.navigate('SubscriptionScreen');
              }
            }}
          >
            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={20} color="#fff" />
            </View>
            <View style={styles.textBox}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
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
    fontSize: 20,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textBox: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 3,
  },
});
