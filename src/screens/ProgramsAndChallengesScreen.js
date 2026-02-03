import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

const ProgramsAndChallengesScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Programs');

    const renderProgramCard = (title, description, duration, imageUri) => (
        <View style={styles.card}>
            <Image source={{ uri: imageUri }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.duration}>{duration}</Text>
                <TouchableOpacity style={styles.enrollButton}>
                    <Text style={styles.enrollText}>Enroll</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Programs & Challenges</Text>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=3' }} // Using avatar as in design top right
                    style={styles.headerAvatar}
                />
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Programs' && styles.activeTab]}
                    onPress={() => setActiveTab('Programs')}
                >
                    <Text style={[styles.tabText, activeTab === 'Programs' && styles.activeTabText]}>Programs</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Challenges' && styles.activeTab]}
                    onPress={() => setActiveTab('Challenges')}
                >
                    <Text style={[styles.tabText, activeTab === 'Challenges' && styles.activeTabText]}>Challenges</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {activeTab === 'Programs' ? (
                    <>
                        {renderProgramCard(
                            'Nutrition Reset',
                            'Learn the fundamentals of healthy eating and build sustainable habits.',
                            '12 weeks',
                            'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                        )}
                        {renderProgramCard(
                            'Strength Training for Beginners',
                            'Build a solid foundation in strength training with progressive workouts.',
                            '8 weeks',
                            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                        )}
                        {renderProgramCard(
                            'Mindfulness & Stress Reduction',
                            'Practice mindfulness techniques to reduce stress and improve mental well-being.',
                            '6 weeks',
                            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                        )}
                    </>
                ) : (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{ color: '#ccc', fontSize: 16 }}>No active challenges at the moment.</Text>
                    </View>
                )}
            </ScrollView>
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
        paddingTop: 40,
        paddingBottom: 20,
    },
    backBtn: {
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerAvatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderWidth: 1,
        borderColor: '#FFD700', // Gold border as per design
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tab: {
        marginRight: 20,
        paddingBottom: 5,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#fff',
    },
    tabText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#1f0033', // Slightly lighter/different dark bg for card
        marginBottom: 20,
        borderRadius: 16,
        padding: 16,
        // Assuming cards have a darker background or similar to main bg but distinct
        // Design shows images taking up top, then text
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    cardDescription: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 12,
        lineHeight: 18,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    duration: {
        color: '#aaa',
        fontSize: 12,
    },
    enrollButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    enrollText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default ProgramsAndChallengesScreen;
