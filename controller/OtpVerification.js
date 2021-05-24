import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ToastAndroid,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import LoaderScreen from '../controller/LoaderScreen';

const OtpVerification = ({navigation, route}) => {
  let textInput = useRef(null);
  const lengthInput = 6;
  const [internalVal, setInternalVal] = useState('');
  const [OTP, setOTP] = useState('');
  const [partner_contactNumber, setContactNumber] = useState('');
  const [isLoading, setLoading] = React.useState(false);

  const onChangeText = val => {
    setInternalVal(val);
  };

  ///==========Login Start================///
  const resentOTP = async () => {
    if (!partner_contactNumber) {
      Alert.alert('Please Enter Your Registered Mobile Number');
      return;
    } else {
      setLoading(true);
      fetch(
        'https://gizmmoalchemy.com/api/pantryo/PartnerAppApi/PantryoPartner.php?flag=resendOTP',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partner_contactNumber: partner_contactNumber,
          }),
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          console.log(result);
          if (result.error == 0) {
            setOTP(result.otp);
            setOTP(result.partner_contactNumber);
            // Alert.alert(result.msg);
            ToastAndroid.showWithGravityAndOffset(
              result.msg,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          } else {
            // Alert.alert(result.msg);
            ToastAndroid.showWithGravityAndOffset(
              result.msg,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            navigation.navigate('LoginScreen');
          }
          // textInputFocus();
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    }
  };
  ///==========Login End================///

  const showToast = msg => {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  const otpMatch = () => {
    if (!internalVal) {
      showToast('Please Enter Otp!');
    } else if (internalVal.length !== 6) {
      showToast('Please enter valid Otp!');
    } else if (OTP == internalVal) {
      showToast('OTP Verification successfully completed!');
      navigation.navigate('RegistrationForm', {
        partner_contactNumber: partner_contactNumber,
      });
    } else {
      showToast('OTP Verification Unsuccessful');
    }
  };

  const textInputFocus = () => {
    textInput.focus();
  };

  useEffect(() => {
    textInputFocus();
    setOTP(route.params.otp);
    setContactNumber(route.params.mobilenumbmer);
  }, []);

  return (
    <>
      {isLoading == true ? <LoaderScreen /> : null}
      <View style={styles.container}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={50}
          behavior="padding"
          style={styles.containerAvoidingView}>
          <Text style={styles.textTile}>
            Enter your 6 Digit OTP sent via SMS
          </Text>

          <View>
            <TextInput
              placeHolder=""
              value={internalVal}
              maxLength={lengthInput}
              onChangeText={onChangeText}
              returnKeyType="done"
              keyboardType="numeric"
              style={styles.otpInput}
              ref={input => (textInput = input)}
            />
            <View style={styles.containerInput}>
              {Array(lengthInput)
                .fill()
                .map((data, index) => (
                  <View key={index} style={styles.cellView}>
                    <Text
                      style={styles.cellTxt}
                      onPress={() => textInput.focus()}>
                      {internalVal && internalVal.length > 0
                        ? internalVal[index]
                        : ''}
                    </Text>
                  </View>
                ))}
            </View>
            {/* <Pressable
              onPress={resentOTP}
              style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <Text
                style={{
                  fontFamily: 'OpenSans-Medium',
                  color: 'blue',
                  fontSize: 16,
                  marginTop: 20,
                }}>
                Resend OTP?
              </Text>
            </Pressable> */}
          </View>
          <Pressable
            // onPress={() => navigation.navigate('RegistrationForm')}
            onPress={() => otpMatch()}
            style={styles.btn}>
            <Text style={styles.btnTxt}>SUBMIT</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9E5',
  },
  containerAvoidingView: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textTile: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
  },
  otpInput: {
    width: 0,
    height: 0,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellView: {
    paddingVertical: 10,
    width: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#5E3360',
  },
  cellTxt: {
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
  },
  btn: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#5E3360',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#FFFFFF',
  },
});
