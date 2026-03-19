import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    PermissionsAndroid,
    Platform,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
    RtcSurfaceView,
    RenderModeType,
} from 'react-native-agora';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { API_BASE_URL } from '../../config/api';

const { width, height } = Dimensions.get('window');

const VideoCallScreen = ({ route, navigation }) => {
    const {
        appointmentId,
        channelName,
        token: initialToken,
        appId,
        callTitle = "Consultation",
        userName = "User"
    } = route.params;

    const user = useSelector(state => state.auth.user);
    const [token, setToken] = useState(initialToken);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const engine = useRef(null);
    const [joined, setJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isFrontCamera, setIsFrontCamera] = useState(true);

    useEffect(() => {
        setupVideoSDKEngine();
        return () => {
            leaveChannel();
        };
    }, [token]);

    const refreshTokenAndRetry = async () => {
        if (refreshing || !appointmentId) return;
        setRefreshing(true);
        setLoading(true);
        try {
            console.log('Token issues detected, refreshing...');
            const response = await axios.post(`${API_BASE_URL}/v1/appointments/${appointmentId}/refresh-token`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log("responsewwwwwwwwwwwwwwwwwwwwwwww", response.data);
            if (response.data?.agora_token) {
                setToken(response.data.agora_token);
                console.log('Token refreshed, retrying join...');
            }
        } catch (error) {
            console.error('Refresh failed:', error);
            Alert.alert('Call Error', 'Session could not be authenticated. Please restart the call.');
            navigation.goBack();
        } finally {
            setRefreshing(false);
        }
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA,
            ]);
        }
    };

    // const setupVideoSDKEngine = async () => {
    //     try {
    //         await requestPermissions();

    //         engine.current = createAgoraRtcEngine();
    //         const rtcEngine = engine.current;

    //         rtcEngine.initialize({
    //             appId: appId,
    //             channelProfile: ChannelProfileType.ChannelProfileCommunication,
    //         });

    //         rtcEngine.setDefaultAudioRouteToSpeakerphone(true);

    //         rtcEngine.registerEventHandler({
    //             onJoinChannelSuccess: (connection, elapsed) => {
    //                 console.log('Successfully joined channel:', connection.channelId);
    //                 setJoined(true);
    //                 setLoading(false);
    //             },
    //             onUserJoined: (connection, remoteUid, elapsed) => {
    //                 setRemoteUid(remoteUid);
    //             },
    //             onUserOffline: (connection, remoteUid, reason) => {
    //                 setRemoteUid(0);
    //             },
    //             onLeaveChannel: (connection, stats) => {
    //                 setJoined(false);
    //             },
    //             onError: (err) => {
    //                 console.error('Agora Error:', err);
    //                 // 109 = Expired, 1052 = Invalid (often means mismatch or old)
    //                 if (err === 109 || err === 1052) {
    //                     refreshTokenAndRetry();
    //                 } else {
    //                     setLoading(false);
    //                     Alert.alert('Call Error', 'Failed to connect. Error: ' + err);
    //                     navigation.goBack();
    //                 }
    //             }
    //         });

    //         rtcEngine.enableVideo();
    //         rtcEngine.enableAudio();
    //         rtcEngine.startPreview();

    //         rtcEngine.joinChannel(
    //             token,
    //             channelName,
    //             0,
    //             {
    //                 channelProfile: ChannelProfileType.ChannelProfileCommunication,
    //                 clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    //                 publishCameraTrack: true,
    //                 publishMicrophoneTrack: true,
    //                 autoSubscribeAudio: true,
    //                 autoSubscribeVideo: true,
    //             }
    //         );

    //     } catch (e) {
    //         console.error('Setup Engine Error:', e);
    //         setLoading(false);
    //     }
    // };

    const setupVideoSDKEngine = async () => {
        try {
            await requestPermissions();

            engine.current = createAgoraRtcEngine();
            const rtcEngine = engine.current;

            rtcEngine.initialize({
                appId: appId,
                channelProfile: ChannelProfileType.ChannelProfileCommunication,
            });

            rtcEngine.registerEventHandler({
                onJoinChannelSuccess: (connection, elapsed) => {
                    console.log('Joined:', connection.channelId);
                    setJoined(true);
                    setLoading(false);

                    // 🔥 FORCE AUDIO ON
                    rtcEngine.enableLocalAudio(true);
                    rtcEngine.muteLocalAudioStream(false);
                    rtcEngine.setEnableSpeakerphone(true);
                },

                onUserJoined: (connection, remoteUid) => {
                    setRemoteUid(remoteUid);

                    // 🔥 FORCE REMOTE AUDIO ON
                    rtcEngine.muteRemoteAudioStream(remoteUid, false);
                },

                onUserOffline: () => {
                    setRemoteUid(0);
                    triggerCompletion();
                },

                onError: (err) => {
                    console.log('Agora error:', err);
                    if (err === 109 || err === 1052) refreshTokenAndRetry();
                }
            });

            // 🔥 AUDIO + VIDEO ENABLE
            await rtcEngine.enableAudio();
            await rtcEngine.enableVideo();
            await rtcEngine.enableLocalAudio(true);
            await rtcEngine.enableLocalVideo(true);

            rtcEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
            rtcEngine.setEnableSpeakerphone(true);

            rtcEngine.startPreview();

            // 🔥 CORRECT JOIN
            rtcEngine.joinChannel(
                token,
                channelName,
                0,
                {
                    publishCameraTrack: true,
                    publishMicrophoneTrack: true,
                    autoSubscribeAudio: true,
                    autoSubscribeVideo: true,
                }
            );

        } catch (e) {
            console.error('Agora setup error:', e);
            setLoading(false);
        }
    };
    const leaveChannel = async () => {
        try {
            if (engine.current) {
                engine.current.leaveChannel();
                engine.current.release();
                engine.current = null;
            }
            setJoined(false);
            setRemoteUid(0);
        } catch (e) {
            console.error('Leave Channel Error:', e);
        }
    };

    const toggleMute = () => {
        const nextState = !isMuted;
        engine.current?.muteLocalAudioStream(nextState);
        setIsMuted(nextState);
    };

    const toggleCamera = () => {
        const nextState = !isCameraOff;
        engine.current?.enableLocalVideo(!nextState);
        setIsCameraOff(nextState);
    };

    const switchCamera = () => {
        engine.current?.switchCamera();
        setIsFrontCamera(!isFrontCamera);
    };

    const triggerCompletion = async () => {
        if (!appointmentId) return;
        try {
            console.log('Sending completion for appointment:', appointmentId);
            await axios.patch(`${API_BASE_URL}/v1/appointments/${appointmentId}/complete`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            console.log("llllllllllllllllllllllllllllllll", appointmentId)
        } catch (error) {
            console.error('Completion call failed:', error?.response?.data || error.message);
        }
    };

    const endCall = async () => {
        await triggerCompletion();
        leaveChannel();

        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            // Fallback if no history (e.g. opened from notification)
            if (user?.role === 'Coach') {
                navigation.replace('CoachDashboard');
            } else {
                navigation.replace('Dashboard');
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Background while loading or waiting */}
            <LinearGradient colors={['#1a0033', '#3b014f', '#5a015a']} style={styles.background}>
                {loading && (
                    <View style={styles.centerContent}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.statusText}>Connecting to {callTitle}...</Text>
                    </View>
                )}
            </LinearGradient>

            {/* Remote Video (Full Screen) */}
            {remoteUid !== 0 ? (
                <RtcSurfaceView
                    canvas={{ uid: remoteUid }}
                    style={styles.fullScreenVideo}
                    zOrderMediaOverlay={false}
                />
            ) : (
                !loading && (
                    <View style={styles.centerContent}>
                        <View style={styles.waitingAvatar}>
                            <Ionicons name="person" size={60} color="rgba(255,255,255,0.3)" />
                        </View>
                        <Text style={styles.statusText}>Waiting for {userName} to join...</Text>
                    </View>
                )
            )}

            {/* Local Video (Small Floating View) */}
            {joined && !isCameraOff && (
                <View style={styles.localVideoContainer}>
                    <RtcSurfaceView
                        canvas={{ uid: 0 }}
                        style={styles.localVideo}
                        zOrderMediaOverlay={true}
                    />
                </View>
            )}

            {/* Header Info */}
            <SafeAreaView style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.callTitle}>{callTitle}</Text>
                        <Text style={styles.callDuration}>
                            {remoteUid !== 0 ? 'In Session' : 'Waiting...'}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={switchCamera} style={styles.iconButtonSmall}>
                        <Ionicons name="camera-reverse" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Control Buttons */}
            <SafeAreaView style={styles.controlsContainer}>
                <View style={styles.controls}>
                    <TouchableOpacity
                        onPress={toggleMute}
                        style={[styles.iconButton, isMuted && styles.activeButton]}
                    >
                        <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={endCall}
                        style={[styles.iconButton, styles.endCallButton]}
                    >
                        <Ionicons name="call" size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleCamera}
                        style={[styles.iconButton, isCameraOff && styles.activeButton]}
                    >
                        <Ionicons name={isCameraOff ? "videocam-off" : "videocam"} size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    fullScreenVideo: {
        flex: 1,
    },
    localVideoContainer: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 120,
        height: 180,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#222',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    localVideo: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
        opacity: 0.8,
    },
    waitingAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    callTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    callDuration: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
    },
    iconButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonSmall: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#ff3b30',
    },
    endCallButton: {
        backgroundColor: '#ff3b30',
        width: 70,
        height: 70,
        borderRadius: 35,
        transform: [{ rotate: '135deg' }],
    },
});

export default VideoCallScreen;
