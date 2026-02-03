import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = [
    { id: '1', name: 'Books', icon: 'book-outline' },
    { id: '2', name: 'Tech', icon: 'hardware-chip-outline' },
    { id: '3', name: 'Housing', icon: 'home-outline' },
    { id: '4', name: 'Services', icon: 'construct-outline' },
];

const LISTINGS = [
    {
        id: '1',
        title: 'Calculus Textbook',
        price: 'Rs 200.00',
        seller: 'Alex',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: '2',
        title: 'Laptop',
        price: 'Rs 700.00',
        seller: 'Eman',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: '3',
        title: 'Apartment',
        price: 'Rs 3200.00/month',
        seller: 'Nash',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: '4',
        title: 'Tutoring',
        price: 'Rs 30.00/hour',
        seller: 'Liam',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=200',
    },
];

const MarketplaceHomeScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const renderCategory = ({ item }) => (
        <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderListing = ({ item }) => (
        <TouchableOpacity
            style={styles.listingItem}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
            <View style={styles.listingInfo}>
                <Text style={styles.listingLabel}>New</Text>
                <Text style={styles.listingTitle}>{item.title}</Text>
                <Text style={styles.listingPrice}>{item.price} - <Text style={styles.sellerName}>{item.seller}</Text></Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.listingImage} />
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
                <Text style={styles.headerTitle}>Market Place</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                    <View style={styles.iconButton}>
                        <Ionicons name="receipt-outline" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
                <FlatList
                    data={CATEGORIES}
                    renderItem={renderCategory}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                />
            </View>

            {/* Listings */}
            <FlatList
                data={LISTINGS}
                renderItem={renderListing}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listingsList}
            />
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
    categoriesContainer: {
        marginBottom: 20,
    },
    categoriesList: {
        paddingHorizontal: 20,
        gap: 15,
    },
    categoryItem: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        // backgroundColor: 'rgba(255,255,255,0.1)',
        // borderRadius: 20,
    },
    categoryText: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '600',
    },
    listingsList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    listingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        paddingBottom: 15,
    },
    listingInfo: {
        flex: 1,
        marginRight: 15,
    },
    listingLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    listingTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    listingPrice: {
        color: '#ccc',
        fontSize: 14,
    },
    sellerName: {
        color: '#aaa',
    },
    listingImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#333',
    },
});

export default MarketplaceHomeScreen;
