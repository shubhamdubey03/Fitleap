import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CoachingScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

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
                <Text style={styles.headerTitle}>Coaching</Text>
                <TouchableOpacity onPress={() => navigation.navigate('VideoConsultation')}>
                    <View style={styles.iconButton}>
                        <Ionicons name="calendar" size={20} color="#ffb74d" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Upcoming</Text>

                {/* Upcoming Session Card */}
                <View style={styles.upcomingCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.todayLabel}>Today</Text>
                        <TouchableOpacity style={styles.joinBtn}>
                            <Text style={styles.joinBtnText}>Join Now</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.sessionTitle}>Nutrition Coaching</Text>
                    <Text style={styles.sessionTime}>10:00 AM - 10:30 AM</Text>

                    <View style={styles.coachRow}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' }}
                            style={styles.coachAvatarSmall}
                        />
                        <Text style={styles.coachNameSmall}>Dr. Emily Carter</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Your Coach</Text>
                <View style={styles.coachProfileCard}>
                    <View style={styles.profileRow}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }}
                            style={styles.coachAvatarLarge}
                        />
                        <View>
                            <Text style={styles.profileName}>Dr. Emily Carter</Text>
                            <Text style={styles.profileRole}>Nutrition Coach</Text>
                        </View>
                        <TouchableOpacity style={styles.videoCallBtn}>
                            <Text style={styles.videoCallText}>Video Call</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Availability</Text>
                <View style={styles.availabilityList}>
                    <View style={styles.availabilityItem}>
                        <View style={styles.dayIcon}>
                            <Ionicons name="calendar-outline" size={20} color="#fff" />
                        </View>
                        <Text style={styles.availabilityText}>Monday, 9:00 AM - 5:00 PM</Text>
                    </View>
                    <View style={styles.availabilityItem}>
                        <View style={styles.dayIcon}>
                            <Ionicons name="calendar-outline" size={20} color="#fff" />
                        </View>
                        <Text style={styles.availabilityText}>Tuesday, 9:00 AM - 5:00 PM</Text>
                    </View>
                    <View style={styles.availabilityItem}>
                        <View style={styles.dayIcon}>
                            <Ionicons name="calendar-outline" size={20} color="#fff" />
                        </View>
                        <Text style={styles.availabilityText}>Wednesday, 8:00 AM - 5:00 PM</Text>
                    </View>
                </View>
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
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
    },
    upcomingCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    todayLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    joinBtn: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    joinBtnText: {
        color: '#4caf50',
        fontSize: 12,
        fontWeight: 'bold',
    },
    sessionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sessionTime: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 15,
    },
    coachRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coachAvatarSmall: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    coachNameSmall: {
        color: '#fff',
        fontSize: 14,
    },
    coachProfileCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    coachAvatarLarge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    profileName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileRole: {
        color: '#ccc',
        fontSize: 12,
    },
    videoCallBtn: {
        backgroundColor: '#5e35b1',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
    },
    videoCallText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    availabilityList: {
        marginTop: 5,
    },
    availabilityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    dayIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    availabilityText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default CoachingScreen;
