import React from 'react';
import {ToastAndroid} from 'react-native';

// ======= Libraries ======= //
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import linking from './controller/linking';
import {AuthContext} from './controller/Utils';
import messaging from '@react-native-firebase/messaging';

// ===== Screens ===== //
import SplashScreen from './controller/SplashScreen';
import LoginScreen from './controller/LoginScreen';
import Navigation from './controller/Navigation';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = React.useState('HomeScreen');
  const [isLoading, setLoading] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const [state, dispatch] = React.useReducer(
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

  React.useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate(remoteMessage.data.type);
    });

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

    if (isLoading) {
      return null;
    }

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
  }, []);

  const authContext = React.useMemo(
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
        } = data;
        AsyncStorage.setItem('partner_id', partner_id);
        AsyncStorage.setItem('partner_shopName', partner_shopName);
        AsyncStorage.setItem('partner_kycStatus', partner_kycStatus);
        AsyncStorage.setItem('partner_category', partner_category);
        AsyncStorage.setItem('partner_category_name', partner_categoryName);
        AsyncStorage.setItem('partner_contactNumber', partner_contactNumber);
        AsyncStorage.setItem('partner_pincode', partner_pincode);
        AsyncStorage.setItem('partner_shopaddress', partner_shopaddress);
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
    <AuthContext.Provider value={authContext}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRoute={initialRoute} headerMode="none">
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
  );
};

export default App;
