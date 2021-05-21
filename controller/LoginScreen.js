import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
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
import LoaderScreen from '../controller/LoaderScreen';

const LoginScreen = ({navigation}) => {
  const [contactNumber, setContactNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const {signIn} = React.useContext(AuthContext);

  return (
    <>
      {loading == true ? <LoaderScreen /> : null}
      <View style={styles.topContainer}>
        <View>
          <Text style={styles.topHeading}>Pantryo</Text>
          <Text style={styles.bottomHeading}>Partner</Text>
        </View>
        <Image source={coffeeIcon} style={styles.topIcon} />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginHeading}>PARTNER LOGIN</Text>
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
          <Pressable
            onPress={() =>
              navigation.navigate('RegistrationForm', {
                partner_contactNumber: '7380993224',
              })
            }
            // onPress={() => {
            //   signIn({contactNumber});
            // }}
            style={styles.btn}>
            <Text style={styles.btnTxt}>CONTINUE</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const Stack = createStackNavigator();

function Login() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
      <Stack.Screen name="Navigation" component={Navigation} />
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
    color: '#E6AF88',
  },
  bottomHeading: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 36,
    marginTop: -15,
    color: '#E6AF88',
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
