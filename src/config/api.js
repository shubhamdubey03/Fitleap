import { Platform } from 'react-native';

// Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator, or local IP for physical device
const LOCALHOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
// NOTE: If using a physical device, ensure your phone is on the same Wi-Fi as your computer.

export const API_BASE_URL = `http://${LOCALHOST}:5000/api`;
export const AUTH_URL = `${API_BASE_URL}/auth`;
export const CHAT_URL = `${API_BASE_URL}/chat`;
