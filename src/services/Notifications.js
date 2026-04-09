import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import axios from 'axios';

import { store } from '../redux/store';
import { increment, addNotification } from '../redux/notificationSlice';
import { API_BASE_URL } from '../config/api';


// ✅ Ask permission
export const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();

    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('✅ Notification permission granted:', authStatus);
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
    }
};


// ✅ Get FCM Token
export const getFcmToken = async () => {
    try {
        const token = await messaging().getToken();
        console.log('🔥 FCM TOKEN:', token);
        return token;
    } catch (error) {
        console.error('❌ Error getting FCM token:', error);
        return null;
    }
};


// ✅ Save Token to Backend (FIXED)
export const saveTokenToBackend = async (userId, token) => {
    try {
        if (!userId || !token) return;

        const authToken = store.getState().auth.user?.token;

        await axios.post(
            `${API_BASE_URL}/notifications/save-token`,
            {
                userId,
                token,   // ✅ ONLY TOKEN (no title/body)
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        console.log("✅ Token saved to backend");
    } catch (error) {
        console.error(
            "❌ Save token error:",
            error.response?.data || error.message
        );
    }
};


// ✅ Token Refresh (VERY IMPORTANT FIX)
export const handleTokenRefresh = (userId) => {
    messaging().onTokenRefresh(async (newToken) => {
        console.log("🔄 Token refreshed:", newToken);
        await saveTokenToBackend(userId, newToken);
    });
};


// ✅ Listen notifications
export const listenToNotifications = () => {

    messaging().onMessage(async remoteMessage => {
        console.log('📩 Foreground Notification:', remoteMessage);

        if (remoteMessage?.notification) {
            store.dispatch(addNotification({
                title: remoteMessage.notification.title,
                body: remoteMessage.notification.body,
                data: remoteMessage.data,
                timestamp: new Date().toISOString()
            }));
        } else {
            store.dispatch(increment());
        }

        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
            title: remoteMessage.notification?.title || "Notification",
            body: remoteMessage.notification?.body || "",
            android: {
                channelId,
                smallIcon: 'ic_launcher',
                pressAction: { id: 'default' },
            },
        });
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('📲 Opened from background:', remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            console.log('🚀 Opened from quit:', remoteMessage);
        }
    });
};


// ✅ INIT FUNCTION (UPDATED)
export const initNotifications = async (userId = null) => {
    try {
        await requestNotificationPermission();

        const token = await getFcmToken();

        if (token) {
            await messaging().subscribeToTopic('all_users');

            if (userId) {
                await saveTokenToBackend(userId, token);
                handleTokenRefresh(userId); // ✅ IMPORTANT
            }
        }

        listenToNotifications();

        return token;
    } catch (error) {
        console.error('❌ Init notification error:', error);
        return null;
    }
};


// ✅ Schedule Water Reminder
export const scheduleWaterReminder = async (intervalMinutes = 1) => {
    try {
        const trigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: Date.now() + intervalMinutes * 60 * 1000,
            alarmManager: true,
        };

        const channelId = await notifee.createChannel({
            id: 'water-reminder',
            name: 'Water Reminder',
            importance: AndroidImportance.HIGH,
        });

        await notifee.createTriggerNotification(
            {
                id: 'water-reminder-id',
                title: '💧 Hydration Time!',
                body: 'Time to drink water!',
                android: {
                    channelId,
                    smallIcon: 'ic_launcher',
                    pressAction: { id: 'default' },
                },
            },
            trigger
        );

        console.log(`💧 Reminder set in ${intervalMinutes} min`);
    } catch (error) {
        console.error('❌ Reminder error:', error);
    }
};

export const cancelWaterReminders = async () => {
    await notifee.cancelNotification('water-reminder-id');
};