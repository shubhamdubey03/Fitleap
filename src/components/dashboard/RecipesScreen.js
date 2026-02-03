import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner'];

const RECIPES = [
    {
        id: '1',
        title: 'Avocado Toast with Egg',
        description: 'A juice and nutritious breakfast option.',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80&w=200',
        category: 'Breakfast',
    },
    {
        id: '2',
        title: 'Quinoa Salad with Grilled Chicken',
        description: 'A light and protein-packed lunch.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
        category: 'Lunch',
    },
    {
        id: '3',
        title: 'Baked Salmon with Roasted Vegetables',
        description: 'A healthy and flavorful dinner.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=200',
        category: 'Dinner',
    },
    {
        id: '4',
        title: 'Greek Yogurt with Berries',
        description: 'A simple and satisfying snack.',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=200',
        category: 'Breakfast',
    },
];

const RecipesScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredRecipes = selectedCategory === 'All'
        ? RECIPES
        : RECIPES.filter(r => r.category === selectedCategory);

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
                <TouchableOpacity onPress={() => navigation.navigate('YourCoinsScreen')}>
                    {/* Using a coin-like icon, assuming accessible from design or font */}
                    <Ionicons name="gift" size={20} color="#ffb74d" />
                </TouchableOpacity>
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
                {filteredRecipes.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() => navigation.navigate('MealDetails', { recipe: item })}
                    >
                        <View style={styles.textContainer}>
                            <Text style={styles.recipeTitle}>{item.title}</Text>
                            <Text style={styles.recipeDesc}>{item.description}</Text>
                        </View>
                        <Image source={{ uri: item.image }} style={styles.recipeImage} />
                    </TouchableOpacity>
                ))}
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
});

export default RecipesScreen;
