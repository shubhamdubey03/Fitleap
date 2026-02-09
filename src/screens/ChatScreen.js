import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { io } from 'socket.io-client';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { CHAT_URL } from '../config/api';

const ChatScreen = ({ route, navigation }) => {
    const { receiverId, receiverName } = route.params;
    const { user } = useSelector(state => state.auth);
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);


    // API URL - Centralized
    const API_URL = CHAT_URL;

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${API_URL}/${user._id}/${receiverId}`);
            setMessages(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };

    // Socket.IO
    useEffect(() => {
        // Connect to Socket.IO server
        const socket = io(CHAT_URL.replace('/api/chat', ''), {
            transports: ['websocket'],
            forceNew: true
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('join', user._id);
        });

        socket.on('receive_message', (newMessage) => {
            console.log('New message received:', newMessage);
            // Only append if the message is from the current chat receiver or self (though self is handled by optimistically or re-fetch)
            if (newMessage.sender_id === receiverId || newMessage.sender_id === user._id) {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user._id, receiverId]);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const newMessageData = {
            senderId: user._id,
            receiverId: receiverId,
            message: inputText.trim()
        };

        try {
            const response = await axios.post(`${API_URL}/send`, newMessageData);
            // Message is added via socket event 'receive_message' usually, but for self-message instantaneous feedback:
            // If the backend emits to sender too, we might get duplicate if we add it here manually.
            // Current backend logic: emits to 'receiverId'. 
            // So we should manually add our own message to the list or wait for a 'message_sent' ack.
            // For now, let's just append it manually since we are not listening to our own room for our own messages?
            // Actually, usually we don't emit to self. So append manually.
            setMessages(prev => [...prev, response.data]);
            setInputText('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    const renderItem = ({ item }) => {
        const isMyMessage = item.sender_id === user._id;
        return (
            <View style={[
                styles.messageBubble,
                isMyMessage ? styles.myMessage : styles.otherMessage
            ]}>
                <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
                    {item.message}
                </Text>
                <Text style={styles.timeText}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <LinearGradient colors={['#1a0033', '#3b014f', '#5a015a']} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{receiverName?.charAt(0) || '?'}</Text>
                    </View>
                    <Text style={styles.headerTitle}>{receiverName}</Text>
                </View>
            </View>

            {/* Messages List */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#a34eff" />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                />
            )}

            {/* Input Area */}
            {/* Input Area */}
            <KeyboardStickyView
                offset={{ closed: 0, opened: 0 }}
            >
                <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 15), backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#ccc"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardStickyView>
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
        paddingTop: 50, // Adjust for status bar
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#a34eff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#a34eff',
        borderBottomRightRadius: 2,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderBottomLeftRadius: 2,
    },
    messageText: {
        fontSize: 15,
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#fff',
    },
    timeText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: '#fff',
        maxHeight: 100,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#a34eff',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
