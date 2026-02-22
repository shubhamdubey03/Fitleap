import React, { useCallback, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setUser } from '../../redux/authSlice';
import { AUTH_URL } from '../../config/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';



const EditProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    // Form State - Only fields that exist in your user data
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        location: '',
        profileImage: null
    });
    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isFetching, setIsFetching] = useState(true);

    // Logs State
    const [updateLogs, setUpdateLogs] = useState([]);

    // Destructure profile state for easier access
    const { name, email, phone, gender, location } = profile;

    // Fetch user profile on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Fetch latest user profile from API
    const fetchUserProfile = async () => {
        setIsFetching(true);

        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            const { data } = await axios.get(`${AUTH_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProfile({
                name: data.user?.name || '',
                email: data.user?.email || '',
                phone: data.user?.phone || '',
                gender: data.user?.gender || '',
                location: data.user?.location || '',
                profileImage: data.user?.profile_image
                    ? { uri: data.user.profile_image }
                    : null,
            });
            dispatch(setUser(data));
            return data;

        } finally {
            setIsFetching(false);
        }
    };

    // Add log entry
    const MAX_LOGS = 50;

    const addLog = (action, status, details = null) => {
        setUpdateLogs(prevLogs => {
            const newLog = {
                id: Date.now(),          // faster + unique enough
                action,
                status,
                details,
                time: new Date().toLocaleTimeString()
            };

            // Avoid large array copy if already max size
            if (prevLogs.length >= MAX_LOGS) {
                return [newLog, ...prevLogs.slice(0, MAX_LOGS - 1)];
            }

            return [newLog, ...prevLogs];
        });

        if (__DEV__) {
            console.log(`${action} → ${status}`, details);
        }
    };

    // Clear logs
    const clearLogs = () => {
        setUpdateLogs([{
            id: Date.now(),
            action: 'Clear Logs',
            status: 'Success',
            details: 'All logs cleared',
            time: new Date().toLocaleTimeString()
        }]);
    };


    // Handle Image Picker
    // Handle Image Picker - FIXED VERSION
    // ✅ FIXED VERSION

    // Handle Image Picker with Cropping
    const pickImage = useCallback(() => {
        Alert.alert(
            'Profile Photo',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: () => {
                        addLog('Camera', 'Started');
                        ImagePicker.openCamera({
                            width: 300,
                            height: 300,
                            cropping: true,
                            mediaType: 'photo',
                            includeBase64: false,
                        }).then(image => {
                            setProfile(prev => ({
                                ...prev,
                                profileImage: {
                                    uri: image.path,
                                    type: image.mime,
                                    fileName: image.filename || `profile_${Date.now()}.jpg`,
                                }
                            }));
                            addLog('Camera', 'Success', { path: image.path });
                        }).catch(err => {
                            if (err.code !== 'E_PICKER_CANCELLED') {
                                addLog('Camera', 'Error', err.message);
                                Alert.alert('Error', err.message);
                            } else {
                                addLog('Camera', 'Cancelled');
                            }
                        });
                    }
                },
                {
                    text: 'Choose from Gallery',
                    onPress: () => {
                        addLog('Gallery', 'Started');
                        ImagePicker.openPicker({
                            width: 300,
                            height: 300,
                            cropping: true,
                            mediaType: 'photo',
                            includeBase64: false,
                        }).then(image => {
                            setProfile(prev => ({
                                ...prev,
                                profileImage: {
                                    uri: image.path,
                                    type: image.mime,
                                    fileName: image.filename || `profile_${Date.now()}.jpg`,
                                }
                            }));
                            addLog('Gallery', 'Success', { path: image.path });
                        }).catch(err => {
                            if (err.code !== 'E_PICKER_CANCELLED') {
                                addLog('Gallery', 'Error', err.message);
                                Alert.alert('Error', err.message);
                            } else {
                                addLog('Gallery', 'Cancelled');
                            }
                        });
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    }, []);


    // Update Profile Image Only
    // Update Profile Image Only - FIXED VERSION
    // Update Profile Image Only - FIXED VERSION
    const updateProfileImageOnly = useCallback(async () => {
        if (!profile?.profileImage?.uri || profile.profileImage.uri.startsWith('http')) return;

        try {
            setIsUploading(true);

            const token = await AsyncStorage.getItem('authToken');
            if (!token) throw new Error('Auth token missing');

            const formData = new FormData();

            formData.append('profileImage', {
                uri: profile.profileImage.uri,
                type: profile.profileImage.type || 'image/jpeg',
                name: profile.profileImage.fileName || `profile_${Date.now()}.jpg`,
            });

            const { data } = await axios.put(
                `${AUTH_URL}/update-profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // ✅ Backend should return updated user
            dispatch(setUser(data));

            // ✅ Update local UI instantly
            setProfile(prev => ({ ...prev, profileImage: { uri: data.profile_image } }));

            Alert.alert('Success', 'Profile image updated');

            return data;

        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Upload failed');
            throw err;
        } finally {
            setIsUploading(false);
        }
    }, [profile]);


    // Update Profile Data Only
    // Update Profile Data Only - FIXED VERSION
    const updateProfileDataOnly = async () => {
        try {
            addLog('Update Profile Data', 'Started');

            let token = await AsyncStorage.getItem('authToken');

            // Fallback: If AsyncStorage is empty, try to get token from Redux user state
            if (!token && user?.token) {
                token = user.token;
                // Optionally save it back to storage to fix future calls
                await AsyncStorage.setItem('authToken', token);
            }

            console.log("Token for update:", token);

            if (!token) {
                throw new Error('No authentication token found');
            }

            const profileData = {
                name: name.trim(),
                phone: phone.trim(),
                gender: gender.trim(),
                location: location.trim(),
            };

            // ✅ CORRECT ENDPOINT for profile data!
            const response = await axios.put(
                `${AUTH_URL}/update-profile`,  // ✅ THIS IS CORRECT!
                profileData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            addLog('Update Profile Data', 'Success');
            return response.data;

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            addLog('Update Profile Data', 'Failed', { error: errorMessage });
            throw error;
        }
    };

    // Handle Image Update Only
    const handleImageUpdate = async () => {
        try {
            setIsUploading(true);
            setError('');

            addLog('Handle Image Update', 'Started');

            if (!profile?.profileImage?.uri) {
                throw new Error('No image selected');
            }

            // 1. Update profile image
            const imageUpdateResult = await updateProfileImageOnly();

            if (imageUpdateResult) {
                // 2. Fetch updated profile data
                const updatedProfile = await fetchUserProfile();

                if (updatedProfile) {
                    addLog('Handle Image Update', 'Success', {
                        message: 'Image updated and profile refreshed',
                        newImageUrl: updatedProfile.profile_image
                    });

                    setSuccessMessage('Profile image updated successfully!');
                    setTimeout(() => setSuccessMessage(''), 3000);
                }
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            setError(errorMessage);

            addLog('Handle Image Update', 'Failed', {
                error: errorMessage
            });

            Alert.alert('Error', errorMessage || 'Failed to update profile image');
        } finally {
            setIsUploading(false);
        }
    };

    // Handle Complete Profile Update
    const handleSave = async () => {
        try {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');

            addLog('Save Profile', 'Started');

            // Validate required fields
            if (!name.trim()) {
                throw new Error('Name is required');
            }
            if (!phone.trim()) {
                throw new Error('Phone number is required');
            }

            let imageUpdated = false;
            let profileUpdated = false;

            // 1. Update profile image if changed
            if (profile?.profileImage?.uri && !profile.profileImage.uri.startsWith('http')) {
                try {
                    const imageUpdateResult = await updateProfileImageOnly();
                    if (imageUpdateResult) {
                        imageUpdated = true;
                        addLog('Save Profile', 'Image Updated', { result: imageUpdateResult });
                    }
                } catch (imageError) {
                    addLog('Save Profile', 'Image Update Failed', { error: imageError.message });
                    Alert.alert('Warning', 'Failed to update profile image. Your other changes can still be saved.');
                }
            }

            // 2. Update profile data
            try {
                const profileUpdateResult = await updateProfileDataOnly();
                if (profileUpdateResult) {
                    profileUpdated = true;
                    addLog('Save Profile', 'Data Updated', { result: profileUpdateResult });
                }
            } catch (profileError) {
                addLog('Save Profile', 'Data Update Failed', { error: profileError.message });
                throw new Error(profileError.message || 'Failed to update profile data');
            }

            // 3. Fetch complete updated profile from server
            if (imageUpdated || profileUpdated) {
                const updatedProfile = await fetchUserProfile();

                if (updatedProfile) {
                    addLog('Save Profile', 'Profile Refreshed', {
                        message: 'User profile updated from server'
                    });
                }
            }

            setSuccessMessage('Profile updated successfully!');
            addLog('Save Profile', 'Completed', {
                message: 'Profile updated successfully',
                imageUpdated,
                profileUpdated
            });

            Alert.alert(
                'Success',
                'Your profile has been updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            setError(errorMessage);

            addLog('Save Profile', 'Failed', {
                error: errorMessage,
                stack: error.stack
            });

            Alert.alert('Error', errorMessage || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle image click
    // const handleImagePress = () => {
    //     Alert.alert(
    //         'Update Profile Image',
    //         'Choose an option',
    //         [
    //             {
    //                 text: 'Select New Image',
    //                 onPress: () => {
    //                     pickImage();
    //                     setTimeout(() => {
    //                         if (profile?.profileImage?.uri) {
    //                             Alert.alert(
    //                                 'Upload Image',
    //                                 'Do you want to upload this image now?',
    //                                 [
    //                                     {
    //                                         text: 'Upload Now',
    //                                         onPress: handleImageUpdate
    //                                     },
    //                                     {
    //                                         text: 'Later',
    //                                         style: 'cancel'
    //                                     }
    //                                 ]
    //                             );
    //                         }
    //                     }, 500);
    //                 }
    //             },
    //             {
    //                 text: 'Cancel',
    //                 style: 'cancel'
    //             }
    //         ]
    //     );
    // };

    // Render Log Entry
    const renderLogEntry = (log) => (
        <View key={log.id} style={styles.logEntry}>
            <Text style={styles.logTimestamp}>
                {new Date(log.timestamp).toLocaleTimeString()}
            </Text>
            <View style={styles.logHeader}>
                <Text style={[
                    styles.logAction,
                    log.status === 'Success' || log.status === 'Completed' ? styles.logSuccess :
                        log.status === 'Failed' || log.status === 'Error' ? styles.logError :
                            styles.logInfo
                ]}>
                    {log.action}
                </Text>
                <Text style={styles.logStatus}>{log.status}</Text>
            </View>
            {log.details && Object.keys(log.details).length > 0 && (
                <Text style={styles.logDetails}>
                    {JSON.stringify(log.details, null, 2)}
                </Text>
            )}
        </View>
    );

    if (isFetching) {
        return (
            <LinearGradient
                colors={['#1a0033', '#3b0a57', '#6a0f6b']}
                style={styles.container}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#1a0033', '#3b0a57', '#6a0f6b']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <SafeAreaView style={styles.safeArea}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        disabled={isLoading}
                    >
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Edit Profile</Text>

                    <TouchableOpacity
                        style={[styles.saveButton, isLoading && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="checkmark" size={24} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Error Message */}
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Success Message */}
                    {successMessage ? (
                        <View style={styles.successContainer}>
                            <Text style={styles.successText}>{successMessage}</Text>
                        </View>
                    ) : null}

                    {/* Profile Image */}
                    {/* Profile Image Section */}
                    <View style={styles.imageContainer}>
                        <View style={styles.imageWrapper}>
                            <TouchableOpacity onPress={pickImage} disabled={isUploading}>
                                <Image
                                    source={{
                                        uri: profile?.profileImage?.uri || user?.profile_image || 'https://i.pravatar.cc/150?img=3'
                                    }}
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.cameraButton, isUploading && styles.disabledButton]}
                                onPress={pickImage}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Ionicons name="camera" size={20} color="#fff" />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* ✅ SHOW UPLOAD BUTTON ONLY FOR NEW LOCAL IMAGES */}
                        {profile?.profileImage?.uri && !profile.profileImage.uri.startsWith('http') && !isUploading && (
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={async () => {
                                    console.log('📸 Upload button pressed');
                                    console.log('Profile image URI:', profile.profileImage.uri);
                                    console.log('Starts with http?', profile.profileImage.uri.startsWith('http'));
                                    try {
                                        await updateProfileImageOnly();
                                    } catch (error) {
                                        // Error already handled
                                    }
                                }}
                            >
                                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                                <Text style={styles.uploadButtonText}>Upload New Image</Text>
                            </TouchableOpacity>
                        )}
                        {isUploading && (
                            <Text style={styles.uploadingText}>Uploading image...</Text>
                        )}
                    </View>

                    {/* Form Fields - Only fields from user data */}
                    <View style={styles.formContainer}>
                        {/* Name Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
                                placeholder="Enter your full name"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                editable={!isLoading}
                            />
                        </View>

                        {/* Email Field (Read Only) */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={email}
                                placeholder="Email"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                editable={false}
                            />
                        </View>

                        {/* Phone Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={(text) => setProfile(prev => ({ ...prev, phone: text }))}
                                keyboardType="phone-pad"
                                placeholder="Enter your phone number"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                editable={!isLoading}
                            />
                        </View>

                        {/* Gender Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Gender</Text>
                            <TextInput
                                style={styles.input}
                                value={gender}
                                onChangeText={(text) => setProfile(prev => ({ ...prev, gender: text }))}
                                placeholder="Male/Female/Other"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                editable={!isLoading}
                            />
                        </View>

                        {/* Location Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                value={location}
                                onChangeText={(text) => setProfile(prev => ({ ...prev, location: text }))}
                                placeholder="City, Country"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                editable={!isLoading}
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveActionBtn, isLoading && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#3b0a57" />
                        ) : (
                            <Text style={styles.saveBtnText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>

                    {/* Refresh Button */}
                    <TouchableOpacity
                        style={styles.refreshBtn}
                        onPress={fetchUserProfile}
                        disabled={isFetching}
                    >
                        <Ionicons name="refresh-outline" size={18} color="#fff" />
                        <Text style={styles.refreshBtnText}>Refresh Profile</Text>
                    </TouchableOpacity>

                    {/* Logs Section */}
                    <View style={styles.logsContainer}>
                        <View style={styles.logsHeader}>
                            <Text style={styles.logsTitle}>Update Logs</Text>
                            <TouchableOpacity
                                onPress={clearLogs}
                                style={styles.clearLogsButton}
                            >
                                <Ionicons name="trash-outline" size={18} color="#fff" />
                                <Text style={styles.clearLogsText}>Clear</Text>
                            </TouchableOpacity>
                        </View>

                        {updateLogs.length === 0 ? (
                            <Text style={styles.noLogsText}>No logs available</Text>
                        ) : (
                            updateLogs.map(renderLogEntry)
                        )}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 50,
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#7b1fa2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'serif',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    errorContainer: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ff6b6b',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
        textAlign: 'center',
    },
    successContainer: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#4caf50',
    },
    successText: {
        color: '#4caf50',
        fontSize: 14,
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    imageWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#7b1fa2',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#1a0033',
    },
    uploadingText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 8,
        opacity: 0.7,
    },
    uploadImageBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7b1fa2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 15,
    },
    uploadImageText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    formContainer: {
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7b1fa2',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 15,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    disabledInput: {
        opacity: 0.6,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    saveActionBtn: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    saveBtnText: {
        color: '#3b0a57',
        fontSize: 16,
        fontWeight: 'bold',
    },
    refreshBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingVertical: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    refreshBtnText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 8,
    },
    logsContainer: {
        marginTop: 30,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        padding: 15,
    },
    logsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    logsTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearLogsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    clearLogsText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 4,
    },
    noLogsText: {
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        padding: 20,
        fontSize: 14,
    },
    logEntry: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    logTimestamp: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        marginBottom: 4,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    logAction: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    logStatus: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    logSuccess: {
        color: '#4caf50',
    },
    logError: {
        color: '#ff6b6b',
    },
    logInfo: {
        color: '#ffd700',
    },
    logDetails: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        marginTop: 4,
    },
});

export default EditProfileScreen;