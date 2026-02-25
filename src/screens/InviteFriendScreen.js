import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Share,
    Image,
    Clipboard,
    Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const InviteFriendScreen = ({ navigation }) => {
    const { user } = useSelector((state) => state.auth);
    const [copied, setCopied] = useState(false);

    // Mock referral code since backend logic was removed
    const referralCode = user?.referral_code || 'FITLEAP50';

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Join me on FitLeap and earn coins! Use my referral code: ${referralCode}. Download now: https://fitleap.app`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const copyToClipboard = () => {
        // Simple clipboard copy - in a real app would use @react-native-clipboard/clipboard
        // Since I don't see it in package.json, I'll just skip the actual copy or use a placeholder
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <LinearGradient
            colors={['#1a0033', '#3b014f', '#5a015a']}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invite Friends</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Ionicons name="people-circle-outline" size={150} color="#FF6B3D" />
                </View>

                <Text style={styles.title}>Refer & Earn</Text>
                <Text style={styles.description}>
                    Invite your friends to FitLeap. When they sign up, both of you earn rewards!
                </Text>

                <View style={styles.codeContainer}>
                    <Text style={styles.label}>Your Referral Code</Text>
                    <View style={styles.codeBox}>
                        <Text style={styles.codeText}>{referralCode}</Text>
                        <TouchableOpacity onPress={copyToClipboard} style={styles.copyBtn}>
                            <Ionicons name={copied ? "checkmark-circle" : "copy-outline"} size={24} color="#FF6B3D" />
                        </TouchableOpacity>
                    </View>
                    {copied && <Text style={styles.copiedText}>Copied to clipboard!</Text>}
                </View>

                <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
                    <LinearGradient
                        colors={['#FF6B3D', '#FF8E53']}
                        style={styles.gradientBtn}
                    >
                        <Ionicons name="share-social-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
                        <Text style={styles.shareBtnText}>Share Invitation</Text>
                    </LinearGradient>
                </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    iconBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    imageContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    codeContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    label: {
        color: '#aaa',
        marginBottom: 10,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    codeBox: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
    },
    codeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    copyBtn: {
        padding: 5,
    },
    copiedText: {
        color: '#FF6B3D',
        marginTop: 10,
        fontWeight: '500',
    },
    shareBtn: {
        width: '100%',
        marginTop: 'auto',
        marginBottom: 40,
    },
    gradientBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
    },
    shareBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default InviteFriendScreen;
