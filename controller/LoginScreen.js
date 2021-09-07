import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
  ToastAndroid,
  ScrollView,
  RefreshControl,
  FlatList,
  ImageBackground,
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

function LoginScreen({navigation}) {
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const {signIn} = useContext(AuthContext);
  const [FCMToken, setFCMToken] = useState('');
  const [banner, setBanner] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getBanner();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Function to get banner images from the server
  async function getBanner() {
    setLoading(true);
    await fetch(
      'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/getallsliderimages.php',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.error == 0) {
          setBanner(result.images);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useMemo(() => {
    getBanner();
  }, []);

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
            let partner_storeImage = result.partner_storeImage;
            let partner_kycStatus = result.partner_kycStatus;
            let partner_paymentStatus = result.partner_paymentStatus;
            let user_token = result.user_token;
            let user_lat = result.partner_lat;
            let user_long = result.partner_long;
            let user_verification = result.partner_verificationStatus;
            let partner_gstStatus = result.partner_gstStatus;
            signIn({
              partner_id,
              partner_contactNumber,
              partner_shopName,
              partner_category,
              partner_categoryName,
              partner_pincode,
              partner_shopaddress,
              partner_storeImage,
              partner_kycStatus,
              partner_paymentStatus,
              user_token,
              user_lat,
              user_long,
              user_verification,
              partner_gstStatus,
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

      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={banner}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        renderItem={({item}) => (
          <>
            <Pressable
              onPress={async () =>
                await analytics().logEvent('loginbanner', {
                  item: item.imageName,
                })
              }
              style={styles.imgcontainer}>
              <ImageBackground
                source={{uri: item.imageName}}
                style={styles.img}
              />
            </Pressable>
          </>
        )}
        keyExtractor={(item, imageName) => String(imageName)}
      />

      <ScrollView style={styles.scroll}>
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
              <Text style={styles.formDigit}>+91-</Text>
              <TextInput
                placeholder="Enter Mobile Number"
                placeholderTextColor="#777"
                style={styles.txtInput}
                keyboardType="phone-pad"
                selectionColor="#5E3360"
                maxLength={10}
                onChangeText={text => setContactNumber(text)}
                onSubmitEditing={loginApi}
              />
            </View>
            <Pressable onPress={loginApi} style={styles.btn}>
              <Text style={styles.btnTxt}>CONTINUE</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
  imgcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
    backgroundColor: '#fff',
  },
  img: {
    width: 500,
    height: 800,
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
  scroll: {
    backgroundColor: '#fff',
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingTop: 20,
  },
  loginLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    color: '#000',
  },
  loginHeading: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#000000',
  },
  logoFirst: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 18,
    color: '#5E3360',
  },
  logoSecond: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 18,
    color: '#F4AA79',
  },
  div: {
    marginTop: 30,
    width: '100%',
  },
  formLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#5E3360',
    marginTop: 10,
  },
  formDigit: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
  },
  txtInput: {
    flex: 1,
    marginLeft: 2,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  btn: {
    backgroundColor: '#5E3360',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#FFFFFF',
    fontSize: 18,
  },
});
