import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';

// Library
import Icons from 'react-native-vector-icons/Ionicons';

import LoaderScreen from '../controller/LoaderScreen';

function OtpVerification({navigation, route}) {
  let textInput = useRef(null);
  const lengthInput = 6;
  const [internalVal, setInternalVal] = useState('');
  const [OTP, setOTP] = useState('');
  const [partner_contactNumber, setContactNumber] = useState('');
  const [isLoading, setLoading] = React.useState(false);

  function showToast(msg) {
    ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }

  function otpMatch() {
    if (!internalVal) {
      showToast('Please Enter Otp!');
    } else if (internalVal.length !== 6) {
      showToast('Please enter valid Otp!');
    } else if (OTP == internalVal) {
      showToast('OTP verified');
      navigation.navigate('RegistrationForm', {
        partner_contactNumber: partner_contactNumber,
      });
    } else {
      showToast('OTP verification failed');
    }
  }

  useEffect(() => {
    setOTP(route.params.otp);
    setContactNumber(route.params.mobilenumbmer);
  }, []);

  return (
    <>
      {isLoading == true ? <LoaderScreen /> : null}
      <View style={styles.container}>
        <Text style={styles.label}>Enter OTP to complete registration</Text>
        <View style={styles.formRow}>
          <Icons name="phone-portrait-outline" size={20} color="#5E3360" />
          <TextInput
            placeholder="X X X X X X"
            placeholderTextColor="#c7c7c7c7"
            value={internalVal}
            onChangeText={setInternalVal}
            keyboardType="number-pad"
            onSubmitEditing={() => otpMatch()}
            style={styles.input}
            autoFocus={true}
          />
        </View>

        <TouchableOpacity onPress={() => otpMatch()} style={styles.btn}>
          <Text style={styles.btnTxt}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  label: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
  },
  formRow: {
    width: '100%',
    marginTop: 20,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: '#5E3360',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    flex: 1,
    marginLeft: 5,
    color: '#000',
  },
  btn: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#5E3360',
  },
  btnTxt: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#fff',
  },
});
