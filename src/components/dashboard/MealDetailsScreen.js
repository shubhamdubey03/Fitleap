import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
// Custom Checkbox implementation below

const CustomCheckbox = ({ checked, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>
    </TouchableOpacity>
);

const MealDetailsScreen = ({ navigation, route }) => {
    const { recipe } = route.params || {
        recipe: {
            title: 'Grilled Salmon with Asparagus',
            description: 'A healthy and delicious meal option, perfect for a light dinner.',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=400'
        }
    };

    const [ingredients, setIngredients] = useState([
        { id: 1, name: 'Salmon Fillet', checked: true },
        { id: 2, name: 'Asparagus', checked: true },
        { id: 3, name: 'Lemon', checked: true },
        { id: 4, name: 'Olive oil', checked: false },
    ]);

    const toggleIngredient = (id) => {
        setIngredients(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

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
                <Text style={styles.headerTitle}>Meal Details</Text>
                <TouchableOpacity>
                    <Ionicons name="star" size={20} color="#ffb74d" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: recipe.image }} style={styles.heroImage} />

                <Text style={styles.title}>{recipe.title}</Text>
                <Text style={styles.description}>{recipe.description}</Text>

                <Text style={styles.sectionTitle}>Nutritional Information</Text>
                <View style={styles.nutritionRow}>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Calories</Text>
                        <Text style={styles.nutritionValue}>450 kcal</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Protein</Text>
                        <Text style={styles.nutritionValue}>30g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Fat</Text>
                        <Text style={styles.nutritionValue}>20g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Carbs</Text>
                        <Text style={styles.nutritionValue}>10g</Text>
                    </View>
                </View>
                <View style={[styles.nutritionRow, { marginTop: 10 }]}>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Fiber</Text>
                        <Text style={styles.nutritionValue}>5g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Sugar</Text>
                        <Text style={styles.nutritionValue}>2g</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Ingredients</Text>
                {ingredients.map(item => (
                    <View key={item.id} style={styles.ingredientRow}>
                        <CustomCheckbox
                            checked={item.checked}
                            onPress={() => toggleIngredient(item.id)}
                        />
                        <Text style={styles.ingredientText}>{item.name}</Text>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>Preparation</Text>
                <Text style={styles.prepStep}>Preheat oven to 400°F.</Text>
                <Text style={styles.prepStep}>Season salmon with salt, pepper, and lemon.</Text>
                <Text style={styles.prepStep}>Roast for 15-20 minutes, or until cooked.</Text>

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
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    heroImage: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 15,
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nutritionItem: {
        flex: 1, // Distribute equal width
    },
    nutritionLabel: {
        color: '#aaa',
        fontSize: 12,
    },
    nutritionValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxContainer: {
        marginRight: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#7b1fa2', // Or checkbox fill color
        borderColor: '#7b1fa2',
    },
    ingredientText: {
        color: '#fff',
        fontSize: 14,
    },
    prepStep: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 20,
    },
});

export default MealDetailsScreen;
