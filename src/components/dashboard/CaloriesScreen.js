import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const CaloriesScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#1a0033', '#3b014f', '#5a015a']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Calories</Text>

        <TouchableOpacity
          style={styles.coin}
          onPress={() => navigation.navigate('YourCoins')}
        >
          <Ionicons name="trophy" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Calories Progress */}
      <View style={styles.progressRow}>
        <Text style={styles.label}>Calories</Text>
        <Text style={styles.value}>1,800 / 3,000</Text>
      </View>

      <View style={styles.progressBarBg}>
        <View style={styles.progressBarFill} />
      </View>

      {/* Macros */}
      <Text style={styles.section}>Macros</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Carbs</Text>
          <Text style={styles.cardValue}>150g</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Protein</Text>
          <Text style={styles.cardValue}>100g</Text>
        </View>
      </View>

      <View style={styles.cardWide}>
        <Text style={styles.cardTitle}>Fats</Text>
        <Text style={styles.cardValue}>50g</Text>
      </View>

      {/* Water */}
      <Text style={styles.section}>Water</Text>

      <View style={styles.progressRow}>
        <Text style={styles.label}>Water Intake</Text>
        <Text style={styles.value}>1.5L / 2L</Text>
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: '75%' }]} />
      </View>

      {/* IF Timer */}
      <Text style={styles.section}>IF Timer</Text>

      <View style={styles.timerRow}>
        <TimerBox value="14" label="Hours" />
        <TimerBox value="30" label="Minutes" />
        <TimerBox value="00" label="Seconds" />
      </View>
    </LinearGradient>
  );
};

const TimerBox = ({ value, label }) => (
  <View style={styles.timerBox}>
    <Text style={styles.timerValue}>{value}</Text>
    <Text style={styles.timerLabel}>{label}</Text>
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  coin: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    color: '#fff',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 14,
  },

  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginTop: 6,
    marginBottom: 20,
  },
  progressBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },

  section: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardWide: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },

  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timerBox: {
    backgroundColor: '#fff',
    width: '30%',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  timerValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  timerLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default CaloriesScreen;
