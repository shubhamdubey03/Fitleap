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

const RowItem = ({ title, subtitle, value }) => (
  <View style={styles.rowItem}>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
    </View>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const EventsRewardsScreen = ({ navigation }) => {
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

        <Text style={styles.headerTitle}>Events & Rewards</Text>

        <View style={styles.coinCircle}>
          <Ionicons name="logo-bitcoin" size={18} color="#FFD700" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Earn Coins */}
        <Text style={styles.mainTitle}>Earn Coins</Text>
        <Text style={styles.description}>
          Complete tasks, collect coins, redeem rewards!
        </Text>

        {/* Daily Quests */}
        <Text style={styles.sectionTitle}>Daily Quests (Resets in 24h)</Text>
        <View style={styles.card}>
          <RowItem title="Log breakfast" subtitle="Log breakfast" value="10" />
          <RowItem title="Drink 2L water" subtitle="Drink 2L water" value="15" />
          <RowItem title="Complete workout" subtitle="Complete workout" value="20" />
          <RowItem title="10,000 steps" subtitle="10,000 steps" value="25" />
          <RowItem title="Sleep 7+ hours" subtitle="Sleep 7+ hours" value="15" />
          <RowItem title="Log mood journal" subtitle="Log mood journal" value="10" />

          <TouchableOpacity style={styles.claimBtn}>
            <Text style={styles.claimText}>Claim All Daily Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Missions */}
        <Text style={styles.sectionTitle}>Weekly Missions</Text>
        <View style={styles.card}>
          <RowItem title="Complete 5 workouts" subtitle="Progress: 3/5" value="100" />
          <RowItem title="Log meals for 7 days" subtitle="Progress: 4/7" value="150" />
          <RowItem title="7-day hydration streak" subtitle="Progress: 5/7" value="120" />
          <RowItem title="Lose 0.5kg this week" subtitle="Progress: 0.3kg" value="200" />
          <RowItem title="5 meditation sessions" subtitle="Progress: 2/5" value="80" />
        </View>

        {/* Special Events */}
        <Text style={styles.sectionTitle}>Special Events</Text>
        <View style={styles.card}>
          <RowItem
            title="New Year Fitness Challenge"
            subtitle="Complete 30 workouts in January"
            value="500"
          />
          <RowItem
            title="Weekend Warrior"
            subtitle="Workout 3 weekends in a row"
            value="150"
          />
          <RowItem
            title="Nutrition Week"
            subtitle="Log all meals for 7 days"
            value="300"
          />
        </View>

        {/* User Stats */}
        <Text style={styles.sectionTitle}>User Stats Widget</Text>
        <View style={styles.card}>
          <RowItem title="Total Coins" value="1500" />
          <RowItem title="Streak" value="7 days" />
          <RowItem title="Level" value="Beginner" />
          <RowItem title="Next Reward at" value="1600 coins" />
        </View>

        {/* Bottom Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>View Rewards Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>Share Progress</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default EventsRewardsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },

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

  mainTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 10,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowTitle: { color: '#fff', fontSize: 13, fontWeight: '500' },
  rowSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  rowValue: { color: '#fff', fontWeight: '600' },

  claimBtn: {
    marginTop: 12,
    backgroundColor: '#5b2d8b',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  claimText: { color: '#fff', fontWeight: '600' },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryText: { color: '#fff', fontSize: 12 },
});
