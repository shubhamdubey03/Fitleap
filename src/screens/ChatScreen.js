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
import { CHAT_URL, SOCKET_URL, MESSAGE_URL } from '../config/api';

const ChatScreen = ({ route, navigation }) => {
    const { receiverId, receiverName } = route.params;
    const { user } = useSelector(state => state.auth);
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [chatId, setChatId] = useState(null);
    const flatListRef = useRef(null);
    const socketRef = useRef(null);

    // Get or Create Chat Room
    const initializeChat = async () => {
        if (!user?.token) {
            console.log('No user token for initializing chat');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(CHAT_URL,
                { coach_id: receiverId },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            console.log('Chat response:', response.data);
            console.log("jjjj", receiverId)
            if (response.data.success) {
                const id = response.data.data.id;
                setChatId(id);
                fetchMessages(id);
            }
        } catch (error) {
            console.error('Error initializing chat:', error.response?.data || error.message);
            setLoading(false);
        }
    };

    const markMessagesAsRead = async (id) => {
        try {
            await axios.patch(`${MESSAGE_URL}/read`,
                { chat_id: id },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const fetchMessages = async (id) => {
        try {
            const url = `${MESSAGE_URL}/${id}/messages`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (response.data.success) {
                // Reverse if the backend sends descending order (which it does in messageController)
                setMessages(response.data.data.reverse());
                markMessagesAsRead(id);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };

    // Socket.IO Connection
    useEffect(() => {
        if (!chatId) return;

        socketRef.current = io(SOCKET_URL.replace('/api', ''), {
            transports: ['websocket'],
            forceNew: true
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('join_chat', chatId);
        });

        socket.on('new_message', (newMessage) => {
            console.log('New message received via socket:', newMessage);
            // Append if it belongs to this chat
            if (newMessage.chat_id === chatId) {
                setMessages(prevMessages => {
                    // Avoid duplicates if we added it manually
                    if (prevMessages.find(m => m.id === newMessage.id)) return prevMessages;
                    return [...prevMessages, newMessage];
                });
                // If we are in the chat, mark it as read
                markMessagesAsRead(chatId);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [chatId]);

    useEffect(() => {
        initializeChat();
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 200);
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || !chatId) return;

        const messageText = inputText.trim();
        setInputText(''); // Clear input early for better UX

        try {
            const response = await axios.post(MESSAGE_URL,
                {
                    chat_id: chatId,
                    message: messageText
                },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            if (response.data.success) {
                // The socket 'new_message' will handle appending for us, 
                // but let's add it manually if the socket is slow/failed for immediate feedback
                const sentMessage = response.data.data;
                setMessages(prev => {
                    if (prev.find(m => m.id === sentMessage.id)) return prev;
                    return [...prev, sentMessage];
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setInputText(messageText); // Restore text on failure
            alert(error.response?.data?.message || 'Failed to send message');
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
            {/* Input Area or Premium Lock */}
            <KeyboardStickyView
                offset={{ closed: 0, opened: 0 }}
            >
                {user.role === 'User' && (!user.is_subscribed || (user.subscribed_coach_ids && !user.subscribed_coach_ids.includes(receiverId))) ? (
                    <View style={[styles.inputContainer, { justifyContent: 'center', flexDirection: 'column', gap: 10 }]}>
                        <Text style={{ color: '#fff', textAlign: 'center' }}>
                            No active subscription found for this coach.
                        </Text>
                        <TouchableOpacity
                            style={[styles.sendButton, { width: 'auto', paddingHorizontal: 20, marginLeft: 0 }]}
                            onPress={() => navigation.navigate('SubscriptionScreen')}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>View Plans</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
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
                )}
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
