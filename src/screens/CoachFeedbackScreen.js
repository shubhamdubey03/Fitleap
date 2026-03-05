import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const CoachFeedbackScreen = ({ navigation }) => {
    const { user } = useSelector((state) => state.auth);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, []);
    console.log("usersssssssssssss", user)

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/coach/${user._id}/feedback`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log("response", response.data)
            setFeedbacks(response.data);
        } catch (error) {
            console.error("Error fetching coach feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#000000', '#1a0b2e', '#2b0040']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Student Feedback</Text>
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#FF6B3D" size="large" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {feedbacks.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="chatbox-ellipses-outline" size={60} color="rgba(255,255,255,0.2)" />
                            <Text style={styles.emptyText}>No feedback received yet.</Text>
                        </View>
                    ) : (
                        feedbacks.map((item, index) => (
                            <View key={index} style={styles.reviewCard}>
                                <View style={styles.row}>
                                    <View style={styles.avatarContainer}>
                                        {item.user?.profile_image ? (
                                            <Image source={{ uri: item.user.profile_image }} style={styles.avatar} />
                                        ) : (
                                            <View style={styles.placeholderAvatar}>
                                                <Text style={styles.placeholderText}>{item.user?.name?.charAt(0) || 'U'}</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <View style={styles.topRow}>
                                            <Text style={styles.userName}>{item.user?.name || 'User'}</Text>
                                            <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                                        </View>

                                        <View style={styles.starRow}>
                                            {[...Array(5)].map((_, i) => (
                                                <Ionicons
                                                    key={i}
                                                    name={i < item.rating ? "star" : "star-outline"}
                                                    size={14}
                                                    color="#FFD700"
                                                />
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
                </ScrollView>
            )}
        </LinearGradient>
    );
};

export default CoachFeedbackScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    reviewCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    placeholderAvatar: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FF6B3D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dateText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 8,
    },
    reviewText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        marginTop: 16,
    },
});
