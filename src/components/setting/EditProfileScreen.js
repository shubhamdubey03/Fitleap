import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSelector } from 'react-redux';

const EditProfileScreen = ({ navigation }) => {
    const { user } = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setGender(user.gender || '');
            setAge(user.age ? String(user.age) : '');
        }
    }, [user]);

    return (
        <LinearGradient
            colors={['#1a0033', '#3b0a57', '#6a0f6b']}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="checkmark" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Profile Image */}
                    <View style={styles.imageContainer}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                                style={styles.profileImage}
                            />
                            <TouchableOpacity style={styles.cameraButton}>
                                <Ionicons name="camera" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <InputField label="Full Name" value={name} onChangeText={setName} />
                        <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" editable={false} />
                        <InputField label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <InputField label="Gender" value={gender} onChangeText={setGender} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <InputField label="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveActionBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.saveBtnText}>Save Changes</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const InputField = ({ label, value, onChangeText, keyboardType = 'default', editable = true }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, !editable && { opacity: 0.6, backgroundColor: 'rgba(0,0,0,0.2)' }]}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholderTextColor="rgba(255,255,255,0.4)"
            editable={editable}
        />
    </View>
);

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
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
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
    row: {
        flexDirection: 'row',
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
});

export default EditProfileScreen;
