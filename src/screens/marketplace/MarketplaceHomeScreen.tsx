import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SPORT_ITEMS = [
    {
        id: '1',
        title: 'Adjustable Dumbbells',
        price: 'Rs 12000',
        seller: 'FitPro Gear',
        image: 'https://images.unsplash.com/photo-1638531952329-87c2b3af695c?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: '2',
        title: 'Yoga Mat Premium',
        price: 'Rs 1500',
        seller: 'Zen Store',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: '3',
        title: 'Running Shoes',
        price: 'Rs 4500',
        seller: 'Speedsters',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: '4',
        title: 'Whey Protein 2kg',
        price: 'Rs 6000',
        seller: 'MuscleUp',
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=200',
    },
    {
        id: '5',
        title: 'Resistance Bands Set',
        price: 'Rs 800',
        seller: 'Home Gym',
        image: 'https://plus.unsplash.com/premium_photo-1664109999537-088e7d964da2?auto=format&fit=crop&q=80&w=200',
    },
];

const MarketplaceHomeScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredItems = SPORT_ITEMS.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderListing = ({ item }: any) => (
        <TouchableOpacity
            style={styles.listingItem}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
            <View style={styles.listingInfo}>
                <Text style={styles.listingLabel}>Sport Gear</Text>
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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('YourCoinsScreen')}>
                        <View style={styles.iconButton}>
                            <Ionicons name="cash-outline" size={20} color="#F5C542" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                        <View style={styles.iconButton}>
                            <Ionicons name="receipt-outline" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
                <TextInput
                    placeholder="Search sports gear..."
                    placeholderTextColor="#ccc"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Listings */}
            <FlatList
                data={filteredItems}
                renderItem={renderListing}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listingsList}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No items found</Text>
                }
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginHorizontal: 20,
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
    emptyText: {
        color: '#ccc',
        textAlign: 'center',
        marginTop: 50,
    }
});

export default MarketplaceHomeScreen;
