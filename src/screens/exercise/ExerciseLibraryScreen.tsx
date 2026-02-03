import React, { useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const WORKOUTS = [
    {
        id: '1',
        title: 'Full Body Workout',
        duration: '30 min',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400',
    },
    {
        id: '2',
        title: 'Upper Body',
        duration: '45 min',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400',
    },
    {
        id: '3',
        title: 'Core Blast',
        duration: '20 min',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400',
    },
    {
        id: '4',
        title: 'Leg Day Challenge',
        duration: '60 min',
        image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?auto=format&fit=crop&q=80&w=400',
    },
    {
        id: '5',
        title: 'Cardio Kickstart',
        duration: '25 min',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    },
    {
        id: '6',
        title: 'Yoga Flow',
        duration: '40 min',
        image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=400',
    },
];

const ExerciseLibraryScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState('Body Part');

    const renderWorkoutItem = ({ item }) => (
        <TouchableOpacity
            style={styles.workoutCard}
            onPress={() => navigation.navigate('WorkoutDetails', { workout: item })}
        >
            <Image source={{ uri: item.image }} style={styles.workoutImage} />
            <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle}>{item.title}</Text>
                <Text style={styles.workoutDuration}>{item.duration}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#1a0033', '#3a005f']}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Exercise Library</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Coaching')}>
                    <View style={styles.iconButton}>
                        {/* Coaching Icon substitute */}
                        <Ionicons name="school" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#ccc"
                        style={styles.searchInput}
                    />
                </View>

                {/* Filters */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterBtn, activeFilter === 'Body Part' && styles.activeFilterBtn]}
                        onPress={() => setActiveFilter('Body Part')}
                    >
                        <Text style={styles.filterText}>Body Part</Text>
                        <Ionicons name="chevron-down" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterBtn, activeFilter === 'Equipment' && styles.activeFilterBtn]}
                        onPress={() => setActiveFilter('Equipment')}
                    >
                        <Text style={styles.filterText}>Equipment</Text>
                        <Ionicons name="chevron-down" size={16} color="#fff" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                </View>

                {/* Grid */}
                <FlatList
                    data={WORKOUTS}
                    renderItem={renderWorkoutItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
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
        marginBottom: 8,
        backgroundColor: '#333',
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
