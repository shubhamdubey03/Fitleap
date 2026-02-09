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
        try {
            const response = await axios.get(`${API_URL}/conversations/${user._id}`);
            setConversations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchConversations();
        }, [])
    );

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => navigation.navigate('ChatScreen', {
                    receiverId: item.userId,
                    receiverName: item.name
                })}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.chatContent}>
                    <View style={styles.topRow}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.time}>
                            {new Date(item.lastMessageTime).toLocaleDateString()}
                        </Text>
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
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
                    keyExtractor={item => item.userId}
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
    }
});

export default ChatListScreen;
