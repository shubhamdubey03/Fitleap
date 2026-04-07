import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';

// Import Store and Action
import { store } from '../redux/store';
import { increment, addNotification } from '../redux/notificationSlice';

// ✅ Ask permission
export const requestNotificationPermission = async () => {
    // For iOS and Android (FCM standard)
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }

    // Android 13+ specific permission
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
        console.log('FCM TOKEN:', token);
        return token;
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
};

// ✅ Save Token to Backend
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const saveTokenToBackend = async (userId, token) => {
    try {
        if (!userId || !token) return;
        
        await axios.post(`${API_BASE_URL}/notifications/save-token`, {
            userId: userId,
            token: token,
            title: "Welcome!",
            body: "Notifications are active."
        });
        console.log("✅ FCM Token successfully synced with backend.");
    } catch (error) {
        console.error("❌ Failed to sync FCM token:", error.message);
    }
};

// ✅ Sync Water Reminder Status
export const syncWaterReminderStatus = async (userId, isEnabled) => {
    try {
        if (!userId) return;
        
        await axios.post(`${API_BASE_URL}/notifications/save-token`, {
            userId: userId,
            water_reminder_enabled: isEnabled,
        });
        console.log(`✅ Water reminder status synced: ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
    } catch (error) {
        console.error("❌ Failed to sync reminder status:", error.message);
    }
};


// ✅ Listen notifications
export const listenToNotifications = () => {

    // Foreground
    messaging().onMessage(async remoteMessage => {
        console.log('Foreground:', remoteMessage.notification);

        // 👉 Dispatch to Redux Store
        if (addNotification) {
            store.dispatch(addNotification({
                title: remoteMessage.notification.title,
                body: remoteMessage.notification.body,
                data: remoteMessage.data,
                timestamp: new Date().toISOString()
            }));
        } else {
            console.warn('addNotification action is undefined. Please reload the app.');
            store.dispatch(increment());
        }

        // Display notification using Notifee
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
                channelId,
                smallIcon: 'ic_launcher', // standard icon
                pressAction: {
                    id: 'default',
                },
            },
        });
        // console.log('Notifee disabled - Foreground notification received');
    });

    // Background click
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Opened from background:', remoteMessage.notification);
    });

    // Killed app click
    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            console.log('Opened from quit:', remoteMessage.notification);
        }
    });
};


// ✅ MAIN INIT FUNCTION
export const initNotifications = async (userId = null) => {
    try {
        await requestNotificationPermission();
        console.log("Permission granted");

        const token = await getFcmToken();
        if (token) {
            console.log("Token retrieved:", token);
            
            // Subscribe to topic
            await messaging().subscribeToTopic('all_users')
                .then(() => console.log('Subscribed to topic: all_users'))
                .catch(e => console.log('Error subscribing to topic:', e));

            // Sync with backend if user is logged in
            if (userId) {
                await saveTokenToBackend(userId, token);
            }
        }

        listenToNotifications();
        return token;
    } catch (error) {
        console.error('Failed to initialize notifications:', error);
        return null;
    }
};

// ✅ Schedule Water Reminder
export const scheduleWaterReminder = async (intervalMinutes = 1) => {
    try {
        const trigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: Date.now() + (intervalMinutes * 60 * 1000), // Fire in X minutes
            alarmManager: true, // Enables exact alarms (requires permission we added)
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
                body: 'Time to drink some water and stay healthy!',
                android: {
                    channelId,
                    smallIcon: 'ic_launcher',
                    pressAction: {
                        id: 'default',
                    },
                },
            },
            trigger,

        );
        console.log(`Water reminder scheduled in ${intervalMinutes} minute(s).`);
    } catch (error) {
        console.error('Error scheduling water reminder:', error);
    }
};

export const cancelWaterReminders = async () => {
    await notifee.cancelNotification('water-reminder-id');
};

