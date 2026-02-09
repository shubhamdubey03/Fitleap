import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const settingsData = [
    { icon: 'person-outline', title: 'Edit Profile', subtitle: 'Edit your profile information' },
    { icon: 'chatbubble-ellipses-outline', title: 'Feedback And Review', subtitle: 'Share your thoughts and experiences' },
    { icon: 'chatbubbles-outline', title: 'Messages', subtitle: 'Chat with coaches and students' },
    { icon: 'gift-outline', title: 'Event & Rewards', subtitle: 'View upcoming events and earned rewards' },
    { icon: 'trophy-outline', title: 'Programs & Challenges', subtitle: 'Join programs and compete in challenges' },
    { icon: 'settings-outline', title: 'Add Habits', subtitle: 'Build and track new healthy habits' },
    { icon: 'card-outline', title: 'Payments & Bills', subtitle: 'Manage your subscriptions and payment methods' },
    { icon: 'document-text-outline', title: 'Invoice', subtitle: 'View and download your payment history' },
    { icon: 'notifications-outline', title: 'Subscription', subtitle: 'Manage your premium plan' },
    { icon: 'help-circle-outline', title: 'Help Center', subtitle: 'Get help and support' },
    { icon: 'bug-outline', title: 'Report Issue', subtitle: 'Report a bug or issue' },
    { icon: 'location-outline', title: 'Address', subtitle: 'Manage your delivery address' },
];

const DashboardSidebar = ({ visible, onClose, navigation }) => {
    const { user } = useSelector((state) => state.auth);

    const navigateTo = (screen) => {
        onClose();
        navigation.navigate(screen);
    };

    const handleNavigation = (item) => {
        onClose();
        if (item.title === 'Edit Profile') {
            navigation.navigate('EditProfileScreen');
        } else if (item.title === 'Feedback And Review') {
            navigation.navigate('FeedbackProgressScreen');
        } else if (item.title === 'Messages') {
            navigation.navigate('ChatListScreen');
        } else if (item.title === 'Event & Rewards') {
            navigation.navigate('EventsRewardsScreen');
        }
        else if (item.title === 'Report Issue') {
            navigation.navigate('ReportIssueScreen');
        }
        else if (item.title === 'Payments & Bills') {
            navigation.navigate('PaymentsAndBillsScreen');
        }
        else if (item.title === 'Add Habits') {
            navigation.navigate('AddHabitScreen');
        }
        else if (item.title === 'Help Center') {
            navigation.navigate('HelpCenterScreen');
        }
        else if (item.title === 'Invoice') {
            navigation.navigate('InvoiceHistoryScreen');
        }
        else if (item.title === 'Programs & Challenges') {
            navigation.navigate('ProgramsAndChallenges');
        }
        else if (item.title === 'Subscription') {
            navigation.navigate('SubscriptionScreen');
        }
        else if (item.title === 'Address') {
            navigation.navigate('AddressScreen');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.overlayArea} />
                </TouchableWithoutFeedback>

                <View style={styles.sidebarContainer}>
                    <LinearGradient
                        colors={['#1a0033', '#3b0a57', '#6a0f6b']}
                        style={styles.gradient}
                    >
                        <View style={styles.header}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                                style={styles.avatar}
                            />
                            <View>
                                <Text style={styles.name}>{user?.name || 'User'}</Text>
                                <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
                            </View>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close-circle-outline" size={30} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.menuItems}>


                            {settingsData.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.menuItem}
                                    onPress={() => handleNavigation(item)}
                                >
                                    <View style={styles.iconBox}>
                                        <Ionicons name={item.icon} size={20} color="#fff" />
                                    </View>
                                    <View style={styles.textBox}>
                                        <Text style={styles.menuText}>{item.title}</Text>
                                        <Text style={styles.menuSubText}>{item.subtitle}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row',
    },
    overlayArea: {
        flex: 1,
    },
    sidebarContainer: {
        width: width * 0.85,
        height: height,
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    gradient: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    email: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 20,
    },
    menuItems: {
        paddingBottom: 120,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    textBox: {
        flex: 1,
    },
    menuText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    menuSubText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
    },
});

export default DashboardSidebar;
