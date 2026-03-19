// ... Imports
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import SafeProgressCircle from '../SafeProgressCircle';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import DashboardSidebar from './DashboardSidebar';
import { reset } from '../../redux/notificationSlice';

// Imported Navigators for SPA mode
import ExerciseStack from '../../navigation/ExerciseNavigator';
import ConsultationNavigator from '../../navigation/ConsultationNavigator';
import MarketplaceNavigator from '../../navigation/MarketplaceNavigator';
import ProfileScreen from '../../screens/ProfileScreen';
import ProgramsAndChallengesScreen from '../../screens/ProgramsAndChallengesScreen';

const CoinIcon = ({ size = 26, style }) => (
  <View style={[{
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#DAA520',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }, style]}>
    <View style={{
      width: size - 6,
      height: size - 6,
      borderRadius: (size - 6) / 2,
      borderWidth: 1,
      borderColor: 'rgba(218, 165, 32, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{
        color: '#B8860B',
        fontSize: size * 0.55,
        fontWeight: 'bold',
        textAlign: 'center',
        includeFontPadding: false,
        textAlignVertical: 'center',
      }}>$</Text>
    </View>
  </View>
);
import { getProfile } from '../../redux/authSlice';
import { AUTH_URL, API_BASE_URL } from '../../config/api';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.notifications);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Home'); // SPA tab state

  const fetchProducts = async () => {
    try {
      const token = user?.token || user?.access_token;
      if (!token) return;

      const response = await axios.get(
        `${API_BASE_URL}/orders/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(response.data.slice(0, 6));
    } catch (error) {
      console.error("Failed to fetch products for dashboard:", error);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const token = user?.token || user?.access_token;
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Notification Data", res.data);
      if (res.data.success) {
        // Simple logic: count unread ones or just set count as total new if needed
        const unread = res.data.data.filter(n => !n.is_read).length;
        dispatch({ type: 'notifications/setCount', payload: unread });
      }
    } catch (e) {
      console.error("Fetch notification count error:", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getProfile());
      fetchProducts();
      fetchNotificationCount();
    }, [dispatch]),
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (activeTab === 'Home') {
          Alert.alert('Exit App', 'Are you sure you want to exit?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => BackHandler.exitApp() },
          ]);
          return true;
        } else {
          setActiveTab('Home');
          return true;
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [activeTab])
  );

  return (
    <LinearGradient colors={['#1a0033', '#3b014f', '#5a015a']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0033" />

      <DashboardSidebar
        visible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
      />

      {/* Static Header above scrollable areas */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <Image
              source={{ uri: user?.profile_image || 'https://i.pravatar.cc/150?img=3' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.hello}>Hello {user?.name || 'User'}</Text>
            <Text style={styles.title}>Let's Explore</Text>
          </View>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('YourCoinsScreen')}>
            <CoinIcon size={26} style={{ marginRight: 15 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            dispatch(reset());
            navigation.navigate('NotificationScreen');
          }}>
            <View>
              <Ionicons name="notifications" size={22} color="#FF6B3D" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Top Navigation Header - SPA Controller */}
      <View style={styles.stickyTabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stickyTabsContainer}>
          {/* Home */}
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Home' && { backgroundColor: 'rgba(0, 230, 118, 0.15)' }]} onPress={() => setActiveTab('Home')}>
            <Ionicons name="home-outline" size={20} color={activeTab === 'Home' ? "#00E676" : "#ccc"} style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'Home' && { color: '#00E676' }]}>Home</Text>
          </TouchableOpacity>

          {/* Exercise */}
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Exercise' && { backgroundColor: 'rgba(255, 107, 61, 0.15)' }]} onPress={() => setActiveTab('Exercise')}>
            <Ionicons name="fitness-outline" size={20} color={activeTab === 'Exercise' ? "#FF6B3D" : "#ccc"} style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'Exercise' && { color: '#FF6B3D' }]}>Exercise</Text>
          </TouchableOpacity>

          {/* Consultation */}
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Consultation' && { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]} onPress={() => setActiveTab('Consultation')}>
            <Ionicons name="chatbubbles-outline" size={20} color={activeTab === 'Consultation' ? "#2196F3" : "#ccc"} style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'Consultation' && { color: '#2196F3' }]}>Consultation</Text>
          </TouchableOpacity>

          {/* Marketplace */}
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Marketplace' && { backgroundColor: 'rgba(233, 30, 99, 0.15)' }]} onPress={() => setActiveTab('Marketplace')}>
            <Ionicons name="cart-outline" size={20} color={activeTab === 'Marketplace' ? "#E91E63" : "#ccc"} style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'Marketplace' && { color: '#E91E63' }]}>Marketplace</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity style={[styles.tabButton, activeTab === 'Profile' && { backgroundColor: 'rgba(156, 39, 176, 0.15)' }]} onPress={() => setActiveTab('Profile')}>
            <Ionicons name="person-outline" size={20} color={activeTab === 'Profile' ? "#9C27B0" : "#ccc"} style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'Profile' && { color: '#9C27B0' }]}>Profile</Text>
          </TouchableOpacity>

          {/* Programs & Challenges */}
          <TouchableOpacity style={[styles.tabButton, activeTab === 'ProgramsAndChallenges' && { backgroundColor: 'rgba(255, 193, 7, 0.15)' }]} onPress={() => setActiveTab('ProgramsAndChallenges')}>
            <Ionicons name="trophy-outline" size={20} color={activeTab === 'ProgramsAndChallenges' ? "#FFC107" : "#ccc"} style={styles.tabIcon} />
            <Text style={[styles.tabText, activeTab === 'ProgramsAndChallenges' && { color: '#FFC107' }]}>Programs</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* View dynamic SPA pages below */}
      <View style={{ flex: 1 }}>

        {/* HOME COMPONENT CONTENT */}
        <View style={{ flex: 1, display: activeTab === 'Home' ? 'flex' : 'none' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Progress Card */}
            <View style={styles.card}>
              <View style={styles.progressCircleContainer}>
                <View style={styles.progressCircle}>
                  <Text style={styles.percent}>81%</Text>
                  <Text style={styles.label}>Calories</Text>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statRow}>
                  <View style={{ marginTop: 14 }}>
                    <Ionicons name="nutrition-outline" size={26} color="#2F80ED" />
                  </View>
                  <View>
                    <Text style={[styles.stat, { textAlign: 'center', color: '#7a7a7aff' }]}>Carbs</Text>
                    <Text style={styles.stat}> 89/140g</Text>
                  </View>
                </View>
                <View style={styles.statRow}>
                  <View style={{ marginTop: 14 }}>
                    <Ionicons name="fish-outline" size={26} color="#FF6B3D" />
                  </View>
                  <View>
                    <Text style={[styles.stat, { textAlign: 'center', color: '#7a7a7aff' }]}>Protein</Text>
                    <Text style={styles.stat}> 45/80g</Text>
                  </View>
                </View>
                <View style={styles.statRow}>
                  <View style={{ marginTop: 14 }}>
                    <Image
                      source={require('../../assets/images/flower.png')}
                      style={styles.flowerIcon}
                    />
                  </View>
                  <View>
                    <Text style={[styles.stat, { textAlign: 'center', color: '#7a7a7aff' }]}>Fiber</Text>
                    <Text style={styles.stat}> 20/50g</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Middle Cards */}
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.progressCircleWrapper}
                onPress={() => setActiveTab('Exercise')}
              >
                <Text style={styles.cardTitle}>Exercise</Text>
                <SafeProgressCircle
                  // percent={75}
                  radius={55}
                  borderWidth={8}
                  color="#2ECC71"
                  bgColor="#fff"
                >
                  <Text style={styles.stepsNumber}>5460</Text>
                  <Text style={styles.stepsLabel}>Steps</Text>
                </SafeProgressCircle>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallCard}
                onPress={() => navigation.navigate('Calories')}
              >
                <Text style={styles.cardTitle}>Calories</Text>
                <Text style={styles.kcal}>540 kcal</Text>
              </TouchableOpacity>
            </View>

            {/* Coaching */}
            <TouchableOpacity
              style={styles.coachCard}
              onPress={() => setActiveTab('Consultation')}
            >
              <Text style={styles.cardTitle}>Coaching</Text>
              <Text style={styles.coach}>{user?.coach_name || 'No Coach Assigned'}</Text>
            </TouchableOpacity>

            {/* Daily Intake */}
            <TouchableOpacity onPress={() => navigation.navigate('Recipes')}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.section}>Daily Intake</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={styles.intakeRow}>
              {['Carbs', 'Protein', 'Fat', 'Fiber'].map(item => {
                let iconName = 'nutrition-outline';
                if (item === 'Protein') iconName = 'fish-outline';
                if (item === 'Fat') iconName = 'flame-outline';
                if (item === 'Fiber') iconName = 'leaf-outline';
                return (
                  <View key={item} style={styles.intake}>
                    <Ionicons name={iconName} size={18} color="#fff" />
                    <Text style={styles.intakeText}>{item}</Text>
                    <Text style={styles.intakeSub}>50/65g</Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity onPress={() => setActiveTab('Marketplace')}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.section}>Shop Equipment's</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {products.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('Marketplace', { screen: 'ProductDetails', params: { product: item } })}
                >
                  <Image
                    source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1599058917212-d750089bc07e' }}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productPrice}>₹{item.price}</Text>
                </TouchableOpacity>
              ))}
              {products.length === 0 && (
                <View style={styles.emptyProducts}>
                  <Text style={{ color: '#ccc' }}>No Equipment Available</Text>
                </View>
              )}
            </ScrollView>
          </ScrollView>
        </View>

        {/* DYNAMIC SCREENS (Rendered when active) */}
        {activeTab === 'Exercise' && (
          <ExerciseStack />
        )}
        {activeTab === 'Consultation' && (
          <ConsultationNavigator />
        )}
        {activeTab === 'Marketplace' && (
          <MarketplaceNavigator />
        )}
        {activeTab === 'Profile' && (
          <ProfileScreen navigation={navigation} hideBack={true} />
        )}
        {activeTab === 'ProgramsAndChallenges' && (
          <ProgramsAndChallengesScreen navigation={navigation} hideBack={true} />
        )}

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 10
  },
  hello: {
    color: '#ccc',
    fontSize: 12
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#ff6b00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percent: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  label: {
    fontSize: 12,
    color: '#666'
  },
  statsContainer: {
    flex: 1,
    marginLeft: 86,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stat: {
    fontSize: 14,
    marginLeft: 6,
    color: '#333',
  },
  flowerIcon: {
    width: 26,
    height: 26,
    tintColor: '#27AE60',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressCircleWrapper: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsNumber: {
    fontSize: 16,
    color: '#FF6B3D',
    fontWeight: 'bold'
  },
  stepsLabel: {
    fontSize: 12,
    color: '#FF6B3D'
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  kcal: {
    fontSize: 18,
    color: '#ff6b00',
    fontWeight: 'bold'
  },
  coachCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  coach: {
    color: '#ff6b00',
    fontWeight: 'bold'
  },
  section: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  intakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  intake: {
    backgroundColor: '#3b145f',
    padding: 12,
    borderRadius: 12,
    width: '23%',
    alignItems: 'center',
  },
  intakeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center'
  },
  intakeSub: {
    color: '#aaa',
    fontSize: 10,
    textAlign: 'center'
  },
  shopImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 10,
  },
  horizontalScroll: {
    marginBottom: 30,
  },
  productCard: {
    width: 140,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#F5C542',
    fontSize: 12,
    marginTop: 4,
  },
  emptyProducts: {
    padding: 20,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stickyTabsWrapper: {
    backgroundColor: '#1a0033',
    paddingVertical: 10,
    marginBottom: 16,
    zIndex: 10,
  },
  stickyTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 15,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  activeTabButton: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#00E676',
  },
});

export default DashboardScreen;