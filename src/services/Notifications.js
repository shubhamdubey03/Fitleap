import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';


// ✅ Ask permission
export const requestNotificationPermission = async () => {
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

    listenToNotifications();

    return token;
};
