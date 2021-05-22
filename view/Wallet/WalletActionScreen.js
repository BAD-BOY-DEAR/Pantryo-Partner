import React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';

// ===== Library ===== //
import Icons from 'react-native-vector-icons/Ionicons';

// ===== Image ===== //
import bg from '../../assets/bg/toBank.jpg';

const WalletActionScreen = () => {
  return (
    <>
      <View style={styles.topContainer}>
        <Image source={bg} style={{width: '100%', height: '100%'}} />
      </View>
      <View style={styles.container}>
        <View style={styles.btn}>
          <Icons name="card-outline" color="#5E3360" size={35} />
          <View style={styles.btnDiv}>
            <Text style={styles.btnTxt}>Transfer Now</Text>
            <Text style={styles.btnCaption}>
              A small transaction fee of 2% will be charged{' '}
            </Text>
          </View>
        </View>
        <View style={styles.btn}>
          <Icons name="information-circle-outline" color="#5E3360" size={35} />
          <View style={styles.btnDiv}>
            <Text style={styles.btnTxt}>Raise A Dispute</Text>
            <Text style={styles.btnCaption}>
              Connect with us for any transaction related queries
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default WalletActionScreen;

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  btnDiv: {
    flex: 1,
    marginLeft: 15,
  },
  btnTxt: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
  },
  btnCaption: {
    fontFamily: 'OpenSans-Regular',
  },
});
