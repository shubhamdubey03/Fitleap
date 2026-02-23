import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../redux/authSlice';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSendEmail = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            const response = await dispatch(forgotPassword(email)).unwrap();

            setIsLoading(false);
            Alert.alert(
                'Email Sent',
                response.message || 'If an account exists with this email, you will receive password reset instructions.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', error.message || 'Something went wrong');
        }
    };

    return (
        <LinearGradient
            colors={['#0f0029', '#2b0040', '#5a003c']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Forgot Password</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    Enter your email address below and we'll send you instructions to reset your password.
                </Text>

                <View style={styles.inputBox}>
                    <Ionicons name="mail-outline" size={20} color="#fff" />
                    <TextInput
                        placeholder="Email Address"
                        placeholderTextColor="#ccc"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendEmail}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.sendButtonText}>Send Email</Text>
                    )}
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 30,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        marginTop: 20,
    },
    description: {
        color: '#ccc',
        fontSize: 16,
        marginBottom: 30,
        lineHeight: 24,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        marginBottom: 25,
    },
    input: {
        flex: 1,
        color: '#fff',
        marginLeft: 10,
    },
    sendButton: {
        backgroundColor: '#14004d',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ForgotPasswordScreen;
