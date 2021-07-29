import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const FeatureTest = () => {
  const userToken1 =
    'cx9uxWt6SU-nlcLWgh32PZ:APA91bEVTsAfDjeJfCV_3h3ZOIM6f2Z9xVesAzZQ2FyV7-t2k4CLKMYNBxm9QCaViqhisjEJqYbvFZiMyKJOh7hKBp7d5TY7yX3PUv80yUuFLKD9s-WqTXOeSHbBHSlLU2jt94s8Ivz9';
  const userToken2 =
    'fx16dI92QUK6luF3mEFUKv:APA91bEOozietpDn30DbDg72y5UY6HyLUw2RbnnAI9_1gegusoDXoU5cT3C0zIjE1qsq1IKOyaizmpSd2Pzfk-DeBi2yU3Kw9oRfITg34_UuyZVhWyliPpczLQCEmevWswJ9UNnSxm8B';

  ///////////////send Notification to Customer
  const sendPushNotification = async () => {
    const CUSTOMER_FIREBASE_API_KEY =
      'AAAAIIoSzdk:APA91bFqAg9Vu4T-_LYX5EPz9UVtqZTp0bRWOpkJLgm6GqIf4QAJtrW6RISmqWHZl6T-ykQrNLpo39kbRHLBsfGmqyz5JP8hxNCUzrfw8ECkcOItsO173OGeIrPf01_jiTLGjJsgwr33';
    const message = {
      to: userToken1,
      collapeKey: 'com.pantryo',
      notification: {
        title: 'Pantryo Customer',
        body: 'Test message',
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

  ///////Send Notification to Delivery Partner
  const sendPushNotification2 = async () => {
    const DELIVERY_PARTNER_FIREBASE_API_KEY =
      'AAAA206GD2Q:APA91bEaq_P49bzza39abiiZgUe_-vVytc7JacVYblNvLgqGPWgKYWZhT-6zdw68tmAsM4wkDDyftgYlXNFaMA5C8IVbEFqaTUUqXLsDA21-6HuiEJqcz-QsDaVkPKVckTAIYL3u3glj';
    const message = {
      to: userToken2,
      collapeKey: 'com.pantryodeliverypartner',
      notification: {
        title: 'Pantryo Delivery Partner',
        body: 'Test message Delivery Partner',
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
      data: {
        title: 'Pantryo Delivery Partner',
        body: 'Test message Delivery Partner',
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + DELIVERY_PARTNER_FIREBASE_API_KEY,
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
          onPress={() => {
            sendPushNotification2();
            sendPushNotification();
          }}
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
