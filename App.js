import React, {useRef, useState, useEffect, useReducer, useMemo} from 'react';
import {
  ToastAndroid,
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';

// ======= Libraries ======= //
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import linking from './controller/linking';
import {AuthContext} from './controller/Utils';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';

// ===== Screens ===== //
import SplashScreen from './controller/SplashScreen';
import LoginScreen from './controller/LoginScreen';
import Navigation from './controller/Navigation';

const Stack = createStackNavigator();

const App = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const navigationRef = useRef();
  const routeNameRef = useRef();

  const [initialRoute, setInitialRoute] = useState('HomeScreen');
  const [isLoading, setLoading] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          if (action.token) {
            AsyncStorage.setItem('userToken', action.token);
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          AsyncStorage.clear();
          AsyncStorage.removeItem('userToken', action.token);
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // alert(JSON.stringify(remoteMessage.data.body));
      console.log(remoteMessage);
      setTitle(remoteMessage.data.title);
      setBody(remoteMessage.data.body);
      setModalVisible(true);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });

    setTimeout(() => {
      const bootstrapAsync = async () => {
        let userToken;

        try {
          userToken = await AsyncStorage.getItem('userToken');
        } catch (e) {}
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      };

      bootstrapAsync();
    }, 3000);
    return unsubscribe;
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        const {
          partner_id,
          partner_contactNumber,
          partner_shopName,
          partner_category,
          partner_categoryName,
          partner_shopaddress,
          partner_pincode,
          partner_kycStatus,
          user_token,
          user_lat,
          user_long,
        } = data;
        AsyncStorage.setItem('partner_id', partner_id);
        AsyncStorage.setItem('partner_shopName', partner_shopName);
        AsyncStorage.setItem('partner_kycStatus', partner_kycStatus);
        AsyncStorage.setItem('partner_category', partner_category);
        AsyncStorage.setItem('partner_category_name', partner_categoryName);
        AsyncStorage.setItem('partner_contactNumber', partner_contactNumber);
        AsyncStorage.setItem('partner_pincode', partner_pincode);
        AsyncStorage.setItem('partner_shopaddress', partner_shopaddress);
        AsyncStorage.setItem('user_long', user_long);
        AsyncStorage.setItem('user_lat', user_lat);
        dispatch({type: 'SIGN_IN', token: 'userToken'});
        AsyncStorage.setItem('userToken', user_token);
        showToast('Welcome');
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {},
    }),
    [],
  );

  return (
    <>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() =>
            (routeNameRef.current =
              navigationRef.current.getCurrentRoute().name)
          }
          onReady={() =>
            (routeNameRef.current =
              navigationRef.current.getCurrentRoute().name)
          }
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName =
              navigationRef.current.getCurrentRoute().name;

            if (previousRouteName !== currentRouteName) {
              // await Analytics.setCurrentScreen(currentRouteName);
              await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              });
            }

            // Save the current route name for later comparison
            routeNameRef.current = currentRouteName;
          }}
          linking={linking}>
          <Stack.Navigator initialRouteName={initialRoute} headerMode="none">
            {state.isLoading ? (
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
            ) : state.userToken == null ? (
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                  title: 'Sign in',
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
            ) : (
              <Stack.Screen
                name="Navigation"
                component={Navigation}
                options={{
                  title: 'Home',
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>

      {/* ========= Order Modal ========= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.orderTitle}>{title}</Text>
            <Text style={styles.orderBody}>{body}</Text>
            <Pressable
              style={styles.orderBtn}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.orderBtnTxt}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* ========= Order Modal ========= */}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.2)',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  orderTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 30,
    color: '#5E3360',
  },
  orderBody: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
    marginTop: 5,
  },
  orderBtn: {
    marginTop: 20,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#5E3360',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  orderBtnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#5E3360',
  },
});
