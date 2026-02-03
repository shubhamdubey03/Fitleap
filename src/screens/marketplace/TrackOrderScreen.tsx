import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TrackOrderScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* Map Area Placeholder */}
            <View style={styles.mapContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }}
                    style={styles.mapImage}
                />
                {/* Back Button Overlay */}
                <TouchableOpacity
                    style={[styles.backButton, { top: insets.top + 10 }]}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* Map Pin Overlay */}
                <View style={styles.mapPin}>
                    <View style={styles.pinPulse} />
                    <Ionicons name="bicycle" size={24} color="#fff" />
                </View>
            </View>

            {/* Tracking Sheet */}
            <LinearGradient
                colors={['#1a0033', '#3a005f']}
                style={styles.sheetContainer}
            >
                <View style={styles.sheetHandle} />

                <View style={styles.statusHeader}>
                    <View>
                        <Text style={styles.etaLabel}>Arriving in 15-20 min</Text>
                        <Text style={styles.courierInfo}>Courier: Alex</Text>
                    </View>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' }}
                        style={styles.courierAvatar}
                    />
                </View>

                {/* Timeline */}
                <View style={styles.timeline}>
                    {/* Step 1 */}
                    <View style={styles.timelineStep}>
                        <View style={styles.timelineIconContainer}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                        </View>
                        <Text style={styles.timelineText}>Order Picked Up</Text>
                    </View>
                    <View style={styles.timelineLineActive} />

                    {/* Step 2 */}
                    <View style={styles.timelineStep}>
                        <View style={styles.timelineIconContainer}>
                            <Ionicons name="bicycle" size={16} color="#fff" />
                        </View>
                        <Text style={styles.timelineText}>On its way</Text>
                    </View>
                    <View style={styles.timelineLineDashed} />

                    {/* Step 3 */}
                    <View style={styles.timelineStep}>
                        <View style={styles.timelineIconContainerInactive}>
                            <Ionicons name="time-outline" size={16} color="#aaa" />
                        </View>
                        <Text style={styles.timelineTextInactive}>Arriving Soon</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="call" size={20} color="#fff" />
                        <Text style={styles.actionText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <Ionicons name="chatbubble" size={20} color="#fff" />
                        <Text style={styles.actionText}>Message</Text>
                    </TouchableOpacity>
                </View>

            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.8,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 5,
    },
    mapPin: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#7b1fa2',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateX: -22 }, { translateY: -22 }],
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 5,
    },
    pinPulse: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(123, 31, 162, 0.3)',
        zIndex: -1,
    },
    sheetContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        paddingBottom: 40,
        minHeight: 350,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    etaLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    courierInfo: {
        color: '#ccc',
        fontSize: 14,
    },
    courierAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#fff',
    },
    timeline: {
        marginBottom: 30,
    },
    timelineStep: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
    },
    timelineIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#1a0033',
    },
    timelineIconContainerInactive: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#1a0033',
    },
    timelineText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    timelineTextInactive: {
        color: '#aaa',
        fontSize: 16,
    },
    timelineLineActive: {
        width: 2,
        height: 25,
        backgroundColor: '#4caf50',
        marginLeft: 13, // Center with icon (28/2 - 1)
        marginVertical: 2,
    },
    timelineLineDashed: {
        width: 2,
        height: 25,
        // Dashed border hack
        borderLeftWidth: 2,
        borderLeftColor: '#666',
        borderStyle: 'dashed',
        marginLeft: 13,
        marginVertical: 2,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 15,
    },
    actionBtn: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default TrackOrderScreen;
