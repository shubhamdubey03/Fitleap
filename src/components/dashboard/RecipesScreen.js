import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getProfile } from '../../redux/authSlice';
import { API_BASE_URL } from '../../config/api';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner'];

const DEFAULT_IMAGES = {
    'Breakfast': 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80&w=200',
    'Lunch': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
    'Dinner': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=200',
    'default': 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=200'
};

const RecipesScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(true); // Default to true to avoid flicker

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getProfile());
            fetchDiets();
        }, [dispatch])
    );

    const fetchDiets = async () => {
        try {
            const token = user?.token || user?.access_token;
            if (!token) return;

            // Fetch user-specific diets (includes free ones assigned to this user)
            const response = await axios.get(`${API_BASE_URL}/diet/diet/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch global free diets (no specific user, visible to all)
            const freeResponse = await axios.get(`${API_BASE_URL}/diet/free`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const mapDiet = item => ({
                id: item.id.toString(),
                title: item.food_name,
                description: `Assigned on ${new Date(item.created_at).toLocaleDateString()}`,
                image: DEFAULT_IMAGES[item.food_type] || DEFAULT_IMAGES.default,
                category: item.food_type,
                is_free: item.is_free
            });

            const userDiets = response.data.success ? response.data.data.map(mapDiet) : [];
            const globalFreeDiets = freeResponse.data.success ? freeResponse.data.data.map(mapDiet) : [];

            // Merge and deduplicate by id
            const dietMap = new Map();
            [...userDiets, ...globalFreeDiets].forEach(d => dietMap.set(d.id, d));

            setRecipes(Array.from(dietMap.values()));
            setIsSubscribed(response.data.is_subscribed ?? true);
        } catch (error) {
            console.error('Fetch diet error:', error);
        } finally {
            setLoading(false);
        }
    };


    const filteredRecipes = selectedCategory === 'All'
        ? recipes
        : recipes.filter(r => r.category?.toLowerCase() === selectedCategory.toLowerCase());

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
                <Text style={styles.headerTitle}>Recipes</Text>
                <View style={{ width: 20 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.tab,
                                selectedCategory === cat && styles.activeTab
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    selectedCategory === cat && styles.activeTabText
                                ]}
                            >
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Recipe List */}
            <ScrollView contentContainerStyle={styles.listContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
                ) : (filteredRecipes.length > 0) ? (
                    <View>
                        {!isSubscribed && (
                            <View style={{ marginBottom: 20, padding: 15, backgroundColor: 'rgba(243, 156, 18, 0.15)', borderRadius: 12, borderWidth: 1, borderColor: '#F39C12' }}>
                                <Text style={{ color: '#F39C12', fontWeight: 'bold', fontSize: 14 }}>Free Sample Diets</Text>
                                <Text style={{ color: '#ccc', fontSize: 12, marginTop: 4 }}>You are viewing free diets provided by your coach. Subscribe for personal meal plans.</Text>
                            </View>
                        )}
                        {filteredRecipes.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.card}
                                onPress={() => navigation.navigate('MealDetails', { recipe: item })}
                            >
                                <View style={styles.textContainer}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text style={styles.recipeTitle}>{item.title}</Text>
                                        {item.is_free && (
                                            <View style={{ backgroundColor: '#2ECC71', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>FREE</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.recipeDesc}>{item.description}</Text>
                                </View>
                                <Image source={{ uri: item.image }} style={styles.recipeImage} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : !isSubscribed ? (
                    <View style={styles.subscribeContainer}>
                        <Ionicons name="lock-closed" size={60} color="rgba(255,255,255,0.3)" />
                        <Text style={styles.subscribeTitle}>Personalized Diet Plans</Text>
                        <Text style={styles.subscribeText}>
                            Subscribe to a coaching plan to get custom diet recommendations from your coach.
                        </Text>
                        <TouchableOpacity
                            style={styles.subscribeBtn}
                            onPress={() => navigation.navigate('SubscriptionScreen')}
                        >
                            <LinearGradient
                                colors={['#F39C12', '#E67E22']}
                                style={styles.subscribeBtnGradient}
                            >
                                <Text style={styles.subscribeBtnText}>View Plans</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No diet plans assigned yet.</Text>
                    </View>
                )}
            </ScrollView>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    tabsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        height: 40,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 10,
    },
    activeTab: {
        backgroundColor: '#7b1fa2', // Purple from design
    },
    tabText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'transparent', // Transparent as per design image it seems or dark purple? Let's assume transparent or slight overlay
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    recipeTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    recipeDesc: {
        color: '#aaa',
        fontSize: 12,
    },
    recipeImage: {
        width: 60,
        height: 60,
        borderRadius: 30, // Circle image
        backgroundColor: '#ccc',
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        color: '#aaa',
        fontSize: 16,
    },
    subscribeContainer: {
        marginTop: 60,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    subscribeTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    subscribeText: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    subscribeBtn: {
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    subscribeBtnGradient: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    subscribeBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RecipesScreen;
