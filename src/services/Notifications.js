import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

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
    const token = await messaging().getToken();
    console.log('FCM TOKEN:', token);

    return token; // send this to backend
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
export const initNotifications = async () => {
    await requestNotificationPermission();
    console.log("permission granted")

    const token = await getFcmToken();
    console.log("token", token)

    // Subscribe to topic
    await messaging().subscribeToTopic('all_users')
        .then(() => console.log('Subscribed to topic: all_users'))
        .catch(e => console.log('Error subscribing to topic:', e));

    listenToNotifications();

    return token;
};
