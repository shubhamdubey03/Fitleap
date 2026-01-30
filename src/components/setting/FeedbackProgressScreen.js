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

const FeedbackProgressScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Feedback & Progress</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView  contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Coaching Session */}
        <Text style={styles.sectionTitle}>Coaching Session Review</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.boldText}>Session with Coach Alex</Text>
              <Text style={styles.subText}>Nutrition & Workout</Text>
            </View>
          </View>
        </View>

        {/* Coach Feedback */}
        <Text style={styles.sectionTitle}>Coach's Feedback</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatarSmall} />
            <View style={{ flex: 1 }}>
              <Text style={styles.boldText}>Coach Alex</Text>
              <Text style={styles.feedbackText}>
                Great job this week! You've shown significant progress in both
                your nutrition and workout routine. Keep up the momentum!
              </Text>
            </View>
          </View>
        </View>

        {/* Progress */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Workouts Completed</Text>
            <Text style={styles.progressValue}>5</Text>
          </View>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Nutrition Goals Met</Text>
            <Text style={styles.progressValue}>6</Text>
          </View>
        </View>

        {/* Reviews */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        <Text style={styles.rating}>4.8</Text>
        <View style={styles.starRow}>
          {[...Array(5)].map((_, i) => (
            <Ionicons key={i} name="star" size={16} color="#FFD700" />
          ))}
          <Text style={styles.reviewCount}>125 reviews</Text>
        </View>

        {/* Rating bars */}
        {[5, 4, 3, 2, 1].map((star, index) => (
          <View key={index} style={styles.ratingRow}>
            <Text style={styles.ratingLabel}>{star}</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${[70, 20, 5, 3, 2][index]}%` }]} />
            </View>
            <Text style={styles.percent}>{[70, 20, 5, 3, 2][index]}%</Text>
          </View>
        ))}

        {/* Reviews List */}
        <View style={styles.reviewCard}>
          <View style={styles.row}>
            <View style={styles.avatarSmall} />
            <View style={{ flex: 1 }}>
              <Text style={styles.boldText}>Sophia Bennett</Text>
              <Text style={styles.subText}>1 month ago</Text>
              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color="#FFD700" />
                ))}
              </View>
              <Text style={styles.reviewText}>
                Harper was incredibly thorough and explained everything clearly.
                I felt very comfortable and confident in her care.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.reviewCard}>
          <View style={styles.row}>
            <View style={styles.avatarSmall} />
            <View style={{ flex: 1 }}>
              <Text style={styles.boldText}>Olivia Carter</Text>
              <Text style={styles.subText}>2 months ago</Text>
              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color="#FFD700" />
                ))}
              </View>
              <Text style={styles.reviewText}>
                Harper was knowledgeable and helpful, but the wait time was a bit long.
              </Text>
            </View>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
};

export default FeedbackProgressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
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
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#999',
    marginRight: 12,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#aaa',
    marginRight: 10,
  },
  boldText: { color: '#fff', fontWeight: '600' },
  subText: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  feedbackText: { color: '#fff', fontSize: 13, marginTop: 4 },
  progressRow: { flexDirection: 'row', gap: 12 },
  progressCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 12,
    padding: 14,
  },
  progressTitle: { color: '#fff', fontSize: 12 },
  progressValue: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 6 },
  rating: { color: '#fff', fontSize: 32, fontWeight: '700' },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reviewCount: { color: '#fff', marginLeft: 6, fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  ratingLabel: { color: '#fff', width: 12 },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  barFill: {
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  percent: { color: '#fff', fontSize: 11 },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  reviewText: { color: '#fff', fontSize: 13, marginTop: 6 },
  button: {
    backgroundColor: '#5b2d8b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
   
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
