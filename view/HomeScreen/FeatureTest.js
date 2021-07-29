import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const FeatureTest = () => {
  const userToken =
    'dI4rZyJKQTClxOwuYKzwqk:APA91bG6fud6CeiiEccES6Dmh1lKwOirVD-FaKwP3KqqUIA1TBwGR4J5pblaUrk75dIjTOrSV8V1q1Ei6Tod7yZOjCb3EIyxhKjmF-65Ts8cpVgaiqAk2PmV76qGqxixHJFOPPxZf5qF';

  const sendPushNotification = async () => {
    const CUSTOMER_FIREBASE_API_KEY =
      'AAAAIIoSzdk:APA91bFqAg9Vu4T-_LYX5EPz9UVtqZTp0bRWOpkJLgm6GqIf4QAJtrW6RISmqWHZl6T-ykQrNLpo39kbRHLBsfGmqyz5JP8hxNCUzrfw8ECkcOItsO173OGeIrPf01_jiTLGjJsgwr33';
    const message = {
      to: userToken,
      collapeKey: 'com.pantryopartner',
      notification: {
        title: 'New Message',
        body: 'New Message',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'New Message',
        body: 'New Message',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + CUSTOMER_FIREBASE_API_KEY,
    });

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
