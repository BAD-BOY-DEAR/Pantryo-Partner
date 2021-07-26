import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'Message handled in the background!' +
      ' ' +
      JSON.stringify(remoteMessage.data.body),
  );
});

AppRegistry.registerComponent(appName, () => App);
