import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

const { width } = Dimensions.get('window');

const CoachDashboardScreen = ({ navigation }) => {
    const [coachName, setCoachName] = useState('Coach');
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    useEffect(() => {
        const getCoachName = async () => {
            // Ideally fetch from storage, defaulting to 'Coach'
            const name = await AsyncStorage.getItem('COACH_NAME');
            if (name) setCoachName(name);
        }
        getCoachName();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('IS_LOGGED_IN');
        await AsyncStorage.removeItem('USER_ROLE');
        await AsyncStorage.removeItem('COACH_NAME'); // Clear coach specific data
        navigation.replace('Login');
    };

    const students = [
        { id: '227be150-696a-4bfc-bee8-d3c121c1d338', name: 'Test User', status: 'Active', plan: 'Yoga Basic' },
        { id: 'a1a13e8e-af57-4215-8e2a-6930c4080676', name: 'Shubham', status: 'Pending', plan: 'Weight Loss' },
    ];

    const renderStudent = ({ item }) => (
        <TouchableOpacity
            style={styles.studentItem}
            onPress={() => navigation.navigate('ChatScreen', {
                receiverId: item.id,
                receiverName: item.name
            })}
        >
            <View style={styles.studentInfo}>
                <View style={styles.studentIcon}>
                    <Ionicons name="person" size={18} color="#fff" />
                </View>
                <View>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.studentPlan}>{item.plan}</Text>
                </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Ionicons name="chatbubble-outline" size={20} color="#FF6B3D" style={{ marginBottom: 5 }} />
                <Text style={[styles.statusText, { color: item.status === 'Active' ? '#2ECC71' : '#F1C40F' }]}>
                    {item.status}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#000000', '#1a0b2e', '#2b0040']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#000000" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/44.jpg' }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.greeting}>Hello {coachName}</Text>
                            <Text style={styles.subGreeting}>Coach Portal</Text>
                        </View>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => navigation.navigate('ChatListScreen')} style={styles.iconBtn}>
                            <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                            <Ionicons name="log-out-outline" size={24} color="#FF6B3D" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Students</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>5</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>$850</Text>
                        <Text style={styles.statLabel}>Earnings</Text>
                    </View>
                </View>

                {/* Schedule / Upcoming Classes */}
                <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {[1, 2, 3].map((item, index) => (
                        <LinearGradient
                            key={index}
                            colors={['#FF6B3D', '#FF8E53']}
                            style={styles.classCard}
                        >
                            <Text style={styles.classTime}>10:00 AM</Text>
                            <Text style={styles.className}>Morning Yoga Flow</Text>
                            <View style={styles.classFooter}>
                                <Ionicons name="videocam-outline" size={16} color="#fff" />
                                <Text style={styles.classLocation}>Online</Text>
                            </View>
                        </LinearGradient>
                    ))}
                </ScrollView>

                {/* Student List */}
                <View style={styles.listHeader}>
                    <Text style={styles.sectionTitle}>My Students</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                </View>

                <View style={styles.studentListContainer}>
                    {students.map((item) => <View key={item.id}>{renderStudent({ item })}</View>)}
                </View>



                <DashboardSidebar
                    visible={isSidebarVisible}
                    onClose={() => setSidebarVisible(false)}
                    navigation={navigation}
                />
            </ScrollView>
        </LinearGradient >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    greeting: {
        color: '#ccc',
        fontSize: 14,
    },
    subGreeting: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    iconBtn: {
        padding: 5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        width: (width - 60) / 3,
        padding: 15,
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        color: '#aaa',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    horizontalScroll: {
        marginBottom: 30,
    },
    classCard: {
        width: 160,
        height: 100,
        borderRadius: 15,
        padding: 15,
        marginRight: 15,
        justifyContent: 'space-between',
    },
    classTime: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '600',
    },
    className: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    classFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    classLocation: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 5,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    seeAll: {
        color: '#FF6B3D',
    },
    studentListContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 15,
    },
    studentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    studentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    studentIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    studentName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    studentPlan: {
        color: '#aaa',
        fontSize: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
});

export default CoachDashboardScreen;
