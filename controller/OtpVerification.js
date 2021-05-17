import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';

const OtpVerification = ({navigation}) => {
  let textInput = useRef(null);
  const lengthInput = 6;
  const [internalVal, setInternalVal] = useState('');

  const onChangeText = val => {
    setInternalVal(val);
  };

  useEffect(() => {
    textInput.focus();
  }, []);

  return (
    <>
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
          </View>
          <Pressable
            onPress={() => navigation.navigate('RegistrationForm')}
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
