// Searching using Search Bar Filter in React Native List View
// https://aboutreact.com/react-native-search-bar-filter-on-listview/

// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
} from 'react-native';

const FeatureTest = () => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      console.log(newData);
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <Text style={styles.itemStyle} onPress={() => getItem(item)}>
        {item.id}
        {'.'}
        {item.title.toUpperCase()}
      </Text>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const getItem = item => {
    // Function for click on an item
    alert('Id : ' + item.id + ' Title : ' + item.title);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
});

export default FeatureTest;
// import React, {useEffect} from 'react';
// import {View, Text, TouchableOpacity} from 'react-native';
// import analytics from '@react-native-firebase/analytics';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging';

// function FeatureTest() {
//   const userToken1 =
//     'cx9uxWt6SU-nlcLWgh32PZ:APA91bEVTsAfDjeJfCV_3h3ZOIM6f2Z9xVesAzZQ2FyV7-t2k4CLKMYNBxm9QCaViqhisjEJqYbvFZiMyKJOh7hKBp7d5TY7yX3PUv80yUuFLKD9s-WqTXOeSHbBHSlLU2jt94s8Ivz9';
//   const userToken2 =
//     'fx16dI92QUK6luF3mEFUKv:APA91bEOozietpDn30DbDg72y5UY6HyLUw2RbnnAI9_1gegusoDXoU5cT3C0zIjE1qsq1IKOyaizmpSd2Pzfk-DeBi2yU3Kw9oRfITg34_UuyZVhWyliPpczLQCEmevWswJ9UNnSxm8B';

//   // Send Notification to Customer
//   async function sendPushNotification() {
//     const CUSTOMER_FIREBASE_API_KEY =
//       'AAAAIIoSzdk:APA91bFqAg9Vu4T-_LYX5EPz9UVtqZTp0bRWOpkJLgm6GqIf4QAJtrW6RISmqWHZl6T-ykQrNLpo39kbRHLBsfGmqyz5JP8hxNCUzrfw8ECkcOItsO173OGeIrPf01_jiTLGjJsgwr33';
//     const message = {
//       to: userToken1,
//       collapeKey: 'com.pantryo',
//       notification: {
//         title: 'Pantryo Customer',
//         body: 'Test message',
//         vibrate: 1,
//         sound: 1,
//         show_in_foreground: true,
//         priority: 'high',
//         content_available: true,
//       },
//       data: {
//         title: 'New Message',
//         body: 'New Message',
//       },
//     };

//     let headers = new Headers({
//       'Content-Type': 'application/json',
//       Authorization: 'key=' + CUSTOMER_FIREBASE_API_KEY,
//     });

//     let response = await fetch('https://fcm.googleapis.com/fcm/send', {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(message),
//     });
//     response = await response.json();
//     console.log(response);
//   }

//   // Send Notification to Delivery Partner
//   async function sendPushNotification2() {
//     const DELIVERY_PARTNER_FIREBASE_API_KEY =
//       'AAAA206GD2Q:APA91bEaq_P49bzza39abiiZgUe_-vVytc7JacVYblNvLgqGPWgKYWZhT-6zdw68tmAsM4wkDDyftgYlXNFaMA5C8IVbEFqaTUUqXLsDA21-6HuiEJqcz-QsDaVkPKVckTAIYL3u3glj';
//     const message = {
//       to: userToken2,
//       collapeKey: 'com.pantryodeliverypartner',
//       notification: {
//         title: 'Pantryo Delivery Partner',
//         body: 'Test message Delivery Partner',
//         vibrate: 1,
//         sound: 1,
//         show_in_foreground: true,
//         priority: 'high',
//         content_available: true,
//       },
//       data: {
//         title: 'Pantryo Delivery Partner',
//         body: 'Test message Delivery Partner',
//       },
//     };

//     let headers = new Headers({
//       'Content-Type': 'application/json',
//       Authorization: 'key=' + DELIVERY_PARTNER_FIREBASE_API_KEY,
//     });
//     // https://fcm.googleapis.com/fcm/send
//     let response = await fetch('https://fcm.googleapis.com/fcm/send', {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(message),
//     });
//     response = await response.json();
//     console.log(response);
//   }

//   return (
//     <>
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//           backgroundColor: '#fff',
//         }}>
//         <Text>Feature Test</Text>
//         {/* <Button
//           title="Button Event"
//           onPress={async () =>
//             await analytics().logEvent('buttonevent', {
//               item: 'button pressed on feature test',
//             })
//           }
//         /> */}
//         {/* <Button
//           title="Press me"
//           // Logs in the firebase analytics console as "select_content" event
//           // only accepts the two object properties which accept strings.
//           onPress={async () =>
//             await analytics().logSelectContent({
//               content_type: 'button',
//               item_id: 'new',
//             })
//           }
//         /> */}
//         <TouchableOpacity
//           onPress={() => {
//             sendPushNotification2();
//             sendPushNotification();
//           }}
//           // onPress={async () =>
//           //   await analytics().logEvent(
//           //     'genericevent',
//           //     {
//           //       item: 'generic event shiv yadav',
//           //     },
//           //     console.log('genericevent'),
//           //   )
//           // }
//           style={{
//             marginTop: 20,
//             backgroundColor: 'lightblue',
//             width: '50%',
//             justifyContent: 'center',
//             alignItems: 'center',
//             paddingVertical: 20,
//             borderRadius: 10,
//           }}>
//           <Text
//             style={{
//               fontSize: 18,
//             }}>
//             Click here
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// }

// export default FeatureTest;
