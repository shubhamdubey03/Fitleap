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
  const [activeTab, setActiveTab] = useState('coach'); // 'coach' or 'product'
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const [coaches, setCoaches] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // The coach or product we are giving feedback for
  const [pastFeedbacks, setPastFeedbacks] = useState([]);
  const [fetchingList, setFetchingList] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);
  useEffect(() => {
    if (selectedItem) {
      fetchPastFeedbacks(selectedItem.id);
    } else {
      setPastFeedbacks([]);
    }
  }, [selectedItem, activeTab]);

  const fetchLists = async () => {
    setFetchingList(true);
    try {
      // Fetch Coaches (Subscriptions)
      const subRes = await axios.get(`${API_BASE_URL}/v1/subscriptions`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log("subRes", subRes.data)
      const activeCoaches = subRes.data
        .filter(s => s.status === 'active' && s.coach)
        .map(s => ({
          id: s.coach_id,
          subscription_id: s.id,
          name: s.coach.name,
          image: s.coach.profile_image,
          type: 'coach'
        }));
      setCoaches(activeCoaches);

      // Fetch Products (Orders)
      const orderRes = await axios.get(`${API_BASE_URL}/orders/user`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log("orderReswwwwwwwwwww", orderRes.data)
      const deliveredProducts = orderRes.data
        .filter(o => o.delivery_status === 'delivered' && o.products)
        .map(o => ({
          id: o.products.id,
          order_id: o.id,
          name: o.products.name,
          image: o.products.image_url,
          type: 'product'
        }));
      setProducts(deliveredProducts);

      // Set default selected item
      if (activeTab === 'coach' && activeCoaches.length > 0) {
        setSelectedItem(activeCoaches[0]);
      } else if (activeTab === 'product' && deliveredProducts.length > 0) {
        setSelectedItem(deliveredProducts[0]);
      }
    } catch (error) {
      console.log("Error fetching lists:", error);
    } finally {
      setFetchingList(false);
    }
  };

  const fetchPastFeedbacks = async (id) => {
    try {
      const endpoint = activeTab === 'coach'
        ? `${API_BASE_URL}/coach/${id}/feedback`
        : `${API_BASE_URL}/product/${id}/review`;
      const response = await axios.get(endpoint);
      setPastFeedbacks(response.data);
    } catch (error) {
      console.log("Error fetching feedbacks:", error);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Error', 'Please provide a comment');
      return;
    }

    if (!selectedItem) {
      Alert.alert('Error', 'Please select an item to review');
      return;
    }

    setLoading(true);
    try {
      let endpoint, payload;
      if (activeTab === 'coach') {
        endpoint = `${API_BASE_URL}/coach/${selectedItem.id}/feedback`;
        payload = {
          rating,
          review: comment,
          subscription_id: selectedItem.subscription_id
        };
      } else {
        endpoint = `${API_BASE_URL}/product/${selectedItem.id}/review`;
        payload = {
          rating,
          review: comment,
          order_id: selectedItem.order_id
        };
      }

      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      Alert.alert('Success', 'Thank you for your feedback!');
      setModalVisible(false);
      setRating(0);
      setComment('');
      fetchPastFeedbacks(selectedItem.id);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id + (item.order_id || item.subscription_id)}
      style={[styles.itemCard, selectedItem?.id === item.id && styles.selectedCard]}
      onPress={() => setSelectedItem(item)}
    >
      <View style={styles.itemAvatar}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
        ) : (
          <Ionicons name={activeTab === 'coach' ? "person" : "cube"} size={20} color="#fff" />
        )}
      </View>
      <Text style={[styles.itemName, selectedItem?.id === item.id && styles.selectedItemName]} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Feedback & Reviews</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'coach' && styles.activeTab]}
          onPress={() => {
            setActiveTab('coach');
            setSelectedItem(coaches[0] || null);
          }}
        >
          <Text style={[styles.tabText, activeTab === 'coach' && styles.activeTabText]}>Coaches</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'product' && styles.activeTab]}
          onPress={() => {
            setActiveTab('product');
            setSelectedItem(products[0] || null);
          }}
        >
          <Text style={[styles.tabText, activeTab === 'product' && styles.activeTabText]}>Products</Text>
        </TouchableOpacity>
      </View>

      {fetchingList ? (
        <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color="#fff" size="large" /></View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          <Text style={styles.subTitle}>Select {activeTab === 'coach' ? 'Coach' : 'Product'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {activeTab === 'coach' ? coaches.map(renderItem) : products.map(renderItem)}
            {(activeTab === 'coach' ? coaches : products).length === 0 && (
              <Text style={styles.emptyText}>No eligible {activeTab}es found.</Text>
            )}
          </ScrollView>

          {selectedItem && (
            <>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Write Review for {selectedItem.name}</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Past Reviews</Text>

              {pastFeedbacks.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No reviews yet for this {activeTab}.</Text>
                </View>
              ) : (
                pastFeedbacks.map((item, index) => (
                  <View key={index} style={styles.reviewCard}>
                    <View style={styles.row}>
                      <View style={styles.avatarSmall}>
                        {item.user?.profile_image ? (
                          <Image source={{ uri: item.user.profile_image }} style={{ width: '100%', height: '100%', borderRadius: 16 }} />
                        ) : (
                          <View style={{ width: '100%', height: '100%', borderRadius: 16, backgroundColor: '#8a2be2', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 10 }}>{item.user?.name?.charAt(0) || 'U'}</Text>
                          </View>
                        )}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.boldText}>{item.user?.name || 'User'}</Text>
                        <Text style={styles.subText}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Just now'}</Text>

                        <View style={styles.starRow}>
                          {[...Array(5)].map((_, i) => (
                            <Ionicons key={i} name={i < item.rating ? "star" : "star-outline"} size={14} color="#FFD700" />
                          ))}
                        </View>

                        <Text style={styles.reviewText}>
                          {item.review}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      )}

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
            {selectedItem && <Text style={styles.modalSubTitle}>{selectedItem.name}</Text>}

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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#5b2d8b',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  subTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  horizontalList: {
    marginBottom: 20,
  },
  itemCard: {
    width: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: 'rgba(91, 45, 139, 0.3)',
    borderColor: '#5b2d8b',
  },
  itemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedItemName: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 10,
  },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    overflow: 'hidden',
  },
  boldText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  subText: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 4 },
  reviewText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4, lineHeight: 18 },
  button: {
    backgroundColor: '#5b2d8b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: '600' },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
    fontSize: 13,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2a0a40',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  modalSubTitle: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  inputStarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  submitButton: {
    backgroundColor: '#5b2d8b',
  },
});
