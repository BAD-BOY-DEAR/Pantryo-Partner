import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
  ToastAndroid,
} from 'react-native';

// ===== Images ===== //
import coffeeIcon from '../assets/icons/coffee.png';

// ===== Library ===== //
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== Screens ===== //
import {AuthContext} from './Utils';
import VerificationScreen from './OtpVerification';
import Navigation from './Navigation';
import RegistrationForm from '../view/HomeScreen/Registration/RegistrationForm';
import UploadDocs from '../view/HomeScreen/Registration/UploadDocs';
import LoaderScreen from '../controller/LoaderScreen';
import messaging from '@react-native-firebase/messaging';
import firebase from 'react-native-firebase';

function LoginScreen({navigation}) {
  const [contactNumber, setContactNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const {signIn} = React.useContext(AuthContext);
  const [FCMToken, setFCMToken] = React.useState('');

  React.useEffect(() => {
    getFCMToken();
  }, []);

  // FCM Token
  async function getFCMToken() {
    messaging()
      .getToken()
      .then(token => {
        // console.log(FCMToken);
        setFCMToken(token);
      });
  }

  function showToast(msg) {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }

  const LoginApiURL =
    'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/login.php';

  // ==========Login Start================ //
  async function loginApi() {
    if (!contactNumber) {
      showToast('Please Enter Your Registered Mobile Number');
      return;
    } else if (contactNumber.length !== 10) {
      showToast('Please Enter Valid  Mobile Number');
      return;
    } else {
      setLoading(true);
      fetch(LoginApiURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partner_contactNumber: contactNumber,
          partner_deviceId: FCMToken,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          // console.log(result);
          if (result.error == 0) {
            let partner_id = result.partner_id;
            let partner_contactNumber = result.partner_contactNumber;
            let partner_shopName = result.partner_shopName;
            let partner_category = result.partner_category;
            let partner_categoryName = result.partner_category_name;
            let partner_pincode = result.partner_pincode;
            let partner_shopaddress = result.partner_shopaddress;
            let partner_kycStatus = result.partner_kycStatus;
            let partner_paymentStatus = result.partner_paymentStatus;
            let user_token = result.user_token;
            let user_lat = result.partner_lat;
            let user_long = result.partner_long;
            let user_verification = result.partner_verificationStatus;
            signIn({
              partner_id,
              partner_contactNumber,
              partner_shopName,
              partner_category,
              partner_categoryName,
              partner_pincode,
              partner_shopaddress,
              partner_kycStatus,
              partner_paymentStatus,
              user_token,
              user_lat,
              user_long,
              user_verification,
            });
          } else if (result.error == 1) {
            navigation.navigate('VerificationScreen', {
              mobilenumbmer: result.partner_contactNumber,
              otp: result.otp,
            });
          } else {
            showToast('Something went wrong');
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <>
      {loading == true ? <LoaderScreen /> : null}
      <View style={styles.topContainer}>
        <View>
          <Text style={styles.topHeading}>PANTRYO</Text>
          <Text style={styles.bottomHeading}>PARTNER</Text>
        </View>
        <Image source={coffeeIcon} style={styles.topIcon} />
      </View>
      <View style={styles.loginContainer}>
        {/* <Text style={styles.loginHeading}>PARTNER LOGIN</Text> */}
        <Text style={styles.loginLabel}>
          Enter your mobile number to Login or Register with{' '}
          <Text style={styles.logoFirst}>
            Pantr
            <Text style={styles.logoSecond}>yo</Text>
          </Text>
        </Text>
        <View style={styles.div}>
          <Text style={styles.formLabel}>10 digit mobile number</Text>
          <View style={styles.formRow}>
            <Text style={styles.formDigit}>+91</Text>
            <TextInput
              placeholder="Enter Mobile Number"
              placeholderTextColor="#777"
              style={styles.txtInput}
              keyboardType="phone-pad"
              selectionColor="#5E3360"
              maxLength={10}
              onChangeText={text => setContactNumber(text)}
            />
          </View>
          <Pressable onPress={loginApi} style={styles.btn}>
            <Text style={styles.btnTxt}>CONTINUE</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const Stack = createStackNavigator();

function Login() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VerificationScreen"
        component={VerificationScreen}
        options={{
          title: 'Enter OTP',
        }}
      />
      <Stack.Screen
        name="RegistrationForm"
        component={RegistrationForm}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UploadDocs"
        component={UploadDocs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Navigation"
        component={Navigation}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default Login;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FEF9E5',
    flexDirection: 'row',
  },
  topHeading: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 36,
    color: '#fadac3',
    letterSpacing: -5,
  },
  bottomHeading: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 36,
    marginTop: -15,
    color: '#fadac3',
    letterSpacing: -3.5,
  },
  topIcon: {
    width: 70,
    height: 70,
    marginLeft: 10,
    marginBottom: 10,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  loginLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#000',
  },
  loginHeading: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#000000',
  },
  logoFirst: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 16,
    color: '#5E3360',
  },
  logoSecond: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 16,
    color: '#F4AA79',
  },
  div: {
    marginTop: 30,
    width: '100%',
  },
  formLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#5E3360',
  },
  formDigit: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  txtInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'OpenSans-Medium',
    fontSize: 16,
    color: '#000',
  },
  btn: {
    backgroundColor: '#5E3360',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#FFFFFF',
  },
});
