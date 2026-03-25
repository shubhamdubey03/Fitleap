import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { getProfile } from '../../redux/authSlice';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ExerciseLibraryScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch<any>();

    // User data from Redux
    const { user } = useSelector((state: any) => state.auth);
    const token = user?.token || user?.access_token;
    const isSubscribed = user?.role !== 'User' || user?.subscription || user?.is_premium || user?.is_subscribed || false;

    // API Data
    const [workouts, setWorkouts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategoryId, setActiveCategoryId] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const headers = { Authorization: `Bearer ${token}` };

            const [workoutRes, categoryRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/workouts`, { headers }),
                axios.get(`${API_BASE_URL}/workout-categories`, { headers })
            ]);

            if (workoutRes.data) setWorkouts(workoutRes.data.data);
            if (categoryRes.data) setCategories(categoryRes.data.data);

            // Re-fetch profile to ensure subscription status is accurate
            dispatch(getProfile());

        } catch (error) {
            console.error('Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const filteredWorkouts = workouts.filter((w: any) => {
        const matchesCategory = activeCategoryId ? w.workout_category_id === activeCategoryId : true;
        const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const renderWorkoutItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.workoutCard}
            onPress={() => {
                if (!isSubscribed) {
                    Alert.alert('Subscription Required', 'Please subscribe to access workouts.');
                    return;
                }
                // navigation.navigate('WorkoutDetails', { workout: item });
            }}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400' }}
                    style={[styles.workoutImage, !isSubscribed && styles.lockedImage]}
                />
                {!isSubscribed && (
                    <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={24} color="#fff" />
                    </View>
                )}
            </View>
            <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>{item.name}</Text>
                <Text style={styles.workoutDuration}>{item.time} min • {item.coin} Coins</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            {/* Header */}
            {/* <View style={styles.header}>
                <Text style={styles.headerTitle}>Library</Text>
            </View> */}

            <View style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search exercises..."
                        placeholderTextColor="#ccc"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Categories / Filters */}
                <View style={{ height: 50, marginBottom: 20 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                        <TouchableOpacity
                            style={[styles.filterBtn, !activeCategoryId && styles.activeFilterBtn]}
                            onPress={() => setActiveCategoryId(null)}
                        >
                            <Text style={styles.filterText}>All</Text>
                        </TouchableOpacity>
                        {categories.map((cat: any) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.filterBtn, activeCategoryId === cat.id && styles.activeFilterBtn]}
                                onPress={() => setActiveCategoryId(cat.id)}
                            >
                                <Text style={styles.filterText}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Locked Message if not subscribed */}
                {!isSubscribed && (
                    <TouchableOpacity
                        style={styles.subscribeBanner}
                        onPress={() => navigation.navigate('SubscriptionScreen')}
                    >
                        <Ionicons name="star" size={20} color="#F5C542" />
                        <Text style={styles.subscribeBannerText}>Unlock Premium Workouts. Subscribe Now!</Text>
                        <Ionicons name="chevron-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                )}

                {/* Grid */}
                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#5e35b1" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredWorkouts}
                        renderItem={renderWorkoutItem}
                        keyExtractor={(item: any) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={{ marginTop: 50, alignItems: 'center' }}>
                                <Text style={{ color: '#aaa' }}>No workouts found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 15,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activeFilterBtn: {
        backgroundColor: '#7b1fa2',
    },
    filterText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    workoutCard: {
        width: (width - 60) / 2, // 20px padding left, 20px padding right, 20px gap
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    workoutImage: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        backgroundColor: '#333',
    },
    imageContainer: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    lockedImage: {
        opacity: 0.4,
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscribeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(245, 197, 66, 0.3)',
    },
    subscribeBannerText: {
        color: '#fff',
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
    },
    workoutInfo: {
        paddingHorizontal: 4,
    },
    workoutTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    workoutDuration: {
        color: '#aaa',
        fontSize: 12,
    },
});

export default ExerciseLibraryScreen;
