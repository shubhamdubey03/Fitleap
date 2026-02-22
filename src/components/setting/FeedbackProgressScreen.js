import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const FeedbackProgressScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);

  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [userFeedbacks, setUserFeedbacks] = useState([]);

  const fetchUserFeedbacks = async () => {
    try {
      const userId = user?.id || user?._id;
      if (!userId) return;
      const response = await axios.get(`${API_BASE_URL}/user-feedback/${userId}`);
      setUserFeedbacks(response.data);
    } catch (error) {
      console.log("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchUserFeedbacks();
  }, [user]);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Error', 'Please provide a comment');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user?.id || user?._id, // Handle different ID fields
        rating,
        comment,
        // Optional: send null for product/order if backend allows
        product_id: null,
        order_id: null,
      };

      await axios.post(`${API_BASE_URL}/feedback`, payload);

      Alert.alert('Success', 'Thank you for your feedback!');
      setModalVisible(false);
      setRating(0);
      setComment('');
      fetchUserFeedbacks(); // Refresh list

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Submit Button Area */}
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Write Detailed Feedback</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>My Past Feedbacks</Text>

        {userFeedbacks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't submitted any feedback yet.</Text>
          </View>
        ) : (
          userFeedbacks.map((item, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.row}>
                {/* User Avatar */}
                <View style={styles.avatarSmall}>
                  {user?.profile_image ? (
                    <Image source={{ uri: user.profile_image }} style={{ width: '100%', height: '100%', borderRadius: 16 }} />
                  ) : (
                    <View style={{ width: '100%', height: '100%', borderRadius: 16, backgroundColor: '#aaa' }} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.boldText}>{user?.name || 'Me'}</Text>
                  <Text style={styles.subText}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Just now'}</Text>

                  <View style={styles.starRow}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons key={i} name={i < item.rating ? "star" : "star-outline"} size={14} color="#FFD700" />
                    ))}
                  </View>

                  <Text style={styles.reviewText}>
                    {item.comment}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Helper Modal for Submission */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rate Your Experience</Text>

            {/* Star Rating Input */}
            <View style={styles.inputStarRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={32}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Write your feedback..."
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#aaa',
    marginRight: 10,
    overflow: 'hidden',
  },
  boldText: { color: '#fff', fontWeight: '600' },
  subText: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 4 },
  reviewText: { color: '#fff', fontSize: 13, marginTop: 2 },
  button: {
    backgroundColor: '#5b2d8b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: '600' },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2a0a40',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputStarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  submitButton: {
    backgroundColor: '#5b2d8b',
  },
});
