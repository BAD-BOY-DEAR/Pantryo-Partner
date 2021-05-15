import React from 'react';

// ===== Libraries ===== //
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import linking from './controller/linking';
import {AuthContext} from './controller/Utils';

// ===== Screens ===== //
import SplashScreen from './controller/SplashScreen';
import LoginScreen from './controller/LoginScreen';
import Navigation from './controller/Navigation';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setLoading] = React.useState();
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

  // Test Commit

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        const {user_mobile, user_password} = data;

        if (!user_mobile) {
          alert('Please Enter Mobile Number!');
          return;
        }
        if (!user_password) {
          alert('Please Enter Password!');
          return;
        }
        fetch('https://lmis.in/MyAPIs/PHP_API/CustomerApp/customerLogin.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: user_mobile,
            password: user_password,
          }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (result) {
            setLoading(false);
            if (result.error == 0) {
              AsyncStorage.setItem('user_id', result.user_id);
              AsyncStorage.setItem('user_name', result.user_name);
              dispatch({type: 'SIGN_IN', token: 'userToken'});
              AsyncStorage.setItem('userToken', '1');
            } else {
              console.log(result.msg);
            }
          })
          .catch(error => {
            console.error(error);
          });

        // dispatch({type: 'SIGN_IN', token: 'userToken'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        const {
          user_mobile,
          user_password,
          user_address,
          user_name,
          user_confirmpassword,
        } = data;

        if (!user_mobile) {
          alert('Please Fill Mobile Number!');
          return;
        }
        if (user_mobile.length !== 10) {
          alert('Please Enter Vailid Mobile Number!');
          return;
        }
        if (!user_password) {
          alert('Please Fill Password!');
          return;
        }
        if (!user_address) {
          alert('Please Fill Address!');
          return;
        }
        if (!user_name) {
          alert('Please Fill Name!');
          return;
        }
        if (!user_confirmpassword) {
          alert('Please Fill Confirm Password!');
          return;
        }
        if (user_password == user_confirmpassword) {
          fetch(
            'https://lmis.in/MyAPIs/PHP_API/CustomerApp/customerRegistration.php',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                mobile: user_mobile,
                password: user_password,
                name: user_name,
                address: user_address,
              }),
            },
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (result) {
              if (result.error == 0) {
                AsyncStorage.setItem('user_id', result.user_id);
                AsyncStorage.setItem('user_name', result.user_name);
                dispatch({type: 'SIGN_IN', token: 'userToken'});
                AsyncStorage.setItem('userToken', '1');
              } else {
              }
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          alert('Password and Confirm Passworsd do not Match!');
          return;
        }
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator headerMode="none">
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
