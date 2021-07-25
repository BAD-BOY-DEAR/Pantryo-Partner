import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const FeatureTest = () => {
  const userToken =
    'd4YaFNS2QLe6FljKzRgF30:APA91bGa9YGnfVTovAGPg4TkXTgdAU4ELAPMemoNB3QqQBycy7LMt_oG65pWxLnzrS6hY39wPgLuxHf4AJKmT9ZVO5a8nWLYNMSdZyNsBLS4EZJUG0EP-4KdJVRvdVrGCXXOUdrAegHX';

  const sendPushNotification = async () => {
    const FIREBASE_API_KEY =
      'AAAALC3Ugt8:APA91bFdhqYhHLlDedpHpuCBX7puDR5x1qsrmc6k3gh-pXIBaUoxTJ3t91pVuBwV51GdrSnYLb9McgZYbGnkVR6-A8BnqsUL8nQKN8Bg3qwwH9puZ01uCt4tnGU7w0qNXL0S-x8Ofnaf';
    const message = {
      to: userToken,
      collapeKey: 'com.pantryopartner',
      notification: {
        title: 'Pantryo Partner',
        body: 'Test message',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'Pantryo Partner',
        body: 'Test message',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });
    // https://fcm.googleapis.com/fcm/send
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Text>Feature Test</Text>
        {/* <Button
          title="Button Event"
          onPress={async () =>
            await analytics().logEvent('buttonevent', {
              item: 'button pressed on feature test',
            })
          }
        /> */}
        {/* <Button
          title="Press me"
          // Logs in the firebase analytics console as "select_content" event
          // only accepts the two object properties which accept strings.
          onPress={async () =>
            await analytics().logSelectContent({
              content_type: 'button',
              item_id: 'new',
            })
          }
        /> */}
        <TouchableOpacity
          onPress={sendPushNotification}
          // onPress={async () =>
          //   await analytics().logEvent(
          //     'genericevent',
          //     {
          //       item: 'generic event shiv yadav',
          //     },
          //     console.log('genericevent'),
          //   )
          // }
          style={{
            marginTop: 20,
            backgroundColor: 'lightblue',
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 18,
            }}>
            Click here
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FeatureTest;
