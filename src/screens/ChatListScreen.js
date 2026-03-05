import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { CHAT_URL } from '../config/api';

const ChatListScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.auth);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);


    // API URL - Centralized
    const API_URL = CHAT_URL;

    const fetchConversations = async () => {
        if (!user?.token) {
            console.log('No user token available for fetching conversations');
            setLoading(false);
            return;
        }
        try {
            console.log(`Fetching conversations from ${CHAT_URL} with token: ${user.token.substring(0, 10)}...`);
            const response = await axios.get(`${CHAT_URL}/conversations`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log('Conversations response:', response.data);
            if (response.data.success) {
                // Filter out any invalid items
                const validConversations = (response.data.data || []).filter(item => item.other_user);
                setConversations(validConversations);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversations:', error.response?.data || error.message);
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchConversations();
        }, [])
    );

    const renderItem = ({ item }) => {
        const otherUser = item.other_user;
        const lastMsg = item.last_message;

        if (!otherUser) return null;

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => navigation.navigate('Chat', {
                    receiverId: otherUser.id,
                    receiverName: otherUser.name,
                    receiverImage: otherUser.profile_image
                })}
            >
                <View style={styles.avatar}>
                    {otherUser.profile_image ? (
                        <Image source={{ uri: otherUser.profile_image }} style={styles.avatarImage} />
                    ) : (
                        <Text style={styles.avatarText}>{otherUser.name?.charAt(0) || '?'}</Text>
                    )}
                </View>
                <View style={styles.chatContent}>
                    <View style={styles.topRow}>
                        <Text style={styles.name}>{otherUser.name}</Text>
                        <Text style={styles.time}>
                            {lastMsg ? new Date(lastMsg.created_at).toLocaleDateString() : ''}
                        </Text>
                    </View>
                    <View style={styles.messageRow}>
                        <Text style={styles.lastMessage} numberOfLines={1}>
                            {lastMsg ? lastMsg.message : 'No messages yet'}
                        </Text>
                        {item.unread_count > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadCountText}>{item.unread_count}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient colors={['#1a0033', '#3b014f', '#5a015a']} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#a34eff" />
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    renderItem={renderItem}
                    keyExtractor={item => item.chat_id?.toString() || Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No conversations yet.</Text>
                    }
                />
            )}
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
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        overflow: 'hidden'
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    chatContent: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    name: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    time: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    lastMessage: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    unreadBadge: {
        backgroundColor: '#FF6B3D',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: 10,
    },
    unreadCountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default ChatListScreen;
