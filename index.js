/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';

// 🔥 Background & killed state handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background notification:', remoteMessage.notification);
});


AppRegistry.registerComponent(appName, () => App);
